import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { allProjectsQuery, slugify, type Project } from "@/lib/projects";
import { uploadMedia, useMediaUrl } from "@/lib/media";

const title = "Studio CMS — ISOFORM";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Manage ISOFORM case studies." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: "Manage ISOFORM case studies." },
    ],
  }),
  component: AdminPage,
});

type Draft = {
  id?: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  category: string;
  year: string;
  description: string;
  challenge: string;
  approach: string;
  solution: string;
  services: string;
  technologies: string;
  live_url: string;
  hero_image: string;
  images: string;
  videos: string;
  display_order: number;
  featured: boolean;
  published: boolean;
};

const EMPTY: Draft = {
  title: "",
  slug: "",
  client: "",
  industry: "",
  category: "",
  year: String(new Date().getFullYear()),
  description: "",
  challenge: "",
  approach: "",
  solution: "",
  services: "",
  technologies: "",
  live_url: "",
  hero_image: "",
  images: "",
  videos: "",
  display_order: 0,
  featured: false,
  published: false,
};

function toDraft(p: Project): Draft {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    client: p.client ?? "",
    industry: p.industry ?? "",
    category: p.category ?? "",
    year: p.year ?? "",
    description: p.description ?? "",
    challenge: p.challenge ?? "",
    approach: p.approach ?? "",
    solution: p.solution ?? "",
    services: (p.services ?? []).join(", "),
    technologies: (p.technologies ?? []).join(", "),
    live_url: p.live_url ?? "",
    hero_image: p.hero_image ?? "",
    images: (p.images ?? []).join("\n"),
    videos: (p.videos ?? []).join("\n"),
    display_order: p.display_order ?? 0,
    featured: p.featured,
    published: p.published,
  };
}

const list = (value: string, sep: "," | "\n") =>
  value
    .split(sep === "," ? /,/ : /\n/)
    .map((s) => s.trim())
    .filter(Boolean);

function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="eyebrow">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const inputClass =
  "w-full border-b border-input bg-transparent py-2 text-sm outline-none focus:border-accent";

function HeroPreview({ path }: { path: string }) {
  const url = useMediaUrl(path || null);
  if (!url) return null;
  return <img src={url} alt="Hero preview" className="mt-3 h-28 w-44 object-cover" />;
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: checkingRole } = useIsAdmin();
  const { data: projects = [], isLoading } = useQuery({ ...allProjectsQuery, enabled: isAdmin === true });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);

  const stats = useMemo(
    () => ({
      total: projects.length,
      published: projects.filter((p) => p.published).length,
      featured: projects.filter((p) => p.featured).length,
    }),
    [projects],
  );

  const save = useMutation({
    mutationFn: async (value: Draft) => {
      const payload = {
        title: value.title.trim(),
        slug: value.slug.trim() || slugify(value.title),
        client: value.client.trim(),
        industry: value.industry.trim(),
        category: value.category.trim(),
        year: value.year.trim(),
        description: value.description.trim(),
        challenge: value.challenge.trim(),
        approach: value.approach.trim(),
        solution: value.solution.trim(),
        services: list(value.services, ","),
        technologies: list(value.technologies, ","),
        live_url: value.live_url.trim(),
        hero_image: value.hero_image.trim() || null,
        images: list(value.images, "\n"),
        videos: list(value.videos, "\n"),
        display_order: Number(value.display_order) || 0,
        featured: value.featured,
        published: value.published,
      };
      if (!payload.title) throw new Error("Title is required");

      const query = value.id
        ? supabase.from("projects").update(payload).eq("id", value.id)
        : supabase.from("projects").insert(payload);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project saved");
      setDraft(null);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const togglePublish = useMutation({
    mutationFn: async (project: Project) => {
      const { error } = await supabase
        .from("projects")
        .update({ published: !project.published })
        .eq("id", project.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onError: (error: Error) => toast.error(error.message),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function handleUpload(files: FileList | null, target: "hero" | "images" | "videos") {
    if (!files?.length || !draft) return;
    setUploading(true);
    try {
      const slug = draft.slug || slugify(draft.title);
      const paths: string[] = [];
      for (const file of Array.from(files)) {
        paths.push(await uploadMedia(file, slug));
      }
      setDraft((current) => {
        if (!current) return current;
        if (target === "hero") return { ...current, hero_image: paths[0]! };
        const key = target === "images" ? "images" : "videos";
        const existing = current[key] ? `${current[key]}\n` : "";
        return { ...current, [key]: existing + paths.join("\n") };
      });
      toast.success("Upload complete");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (checkingRole) {
    return (
      <div className="shell py-32">
        <p className="eyebrow">Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="shell flex min-h-screen flex-col justify-center py-32">
        <p className="eyebrow">Restricted</p>
        <h1 className="display-lg mt-6">No studio access</h1>
        <p className="mt-6 max-w-md text-sm text-muted-foreground">
          This account is signed in but has no administrator role, so the CMS stays locked.
        </p>
        <div className="mt-8 flex gap-6 text-sm">
          <button onClick={handleSignOut} className="link-underline">
            Sign out
          </button>
          <Link to="/" className="link-underline">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-20 md:py-28">
      <header className="rule-b flex flex-wrap items-end justify-between gap-6 pb-8">
        <div>
          <p className="eyebrow">ISOFORM</p>
          <h1 className="display-lg mt-3">Studio CMS</h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/work" className="link-underline">
            View site
          </Link>
          <button onClick={handleSignOut} className="link-underline">
            Sign out
          </button>
        </div>
      </header>

      <dl className="rule-b grid grid-cols-3 gap-6 py-8">
        {[
          { label: "Projects", value: stats.total },
          { label: "Published", value: stats.published },
          { label: "Featured", value: stats.featured },
        ].map((s) => (
          <div key={s.label}>
            <dt className="eyebrow">{s.label}</dt>
            <dd className="display-md mt-2">{String(s.value).padStart(2, "0")}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="eyebrow">Case studies</h2>
        <button
          onClick={() => setDraft({ ...EMPTY, display_order: projects.length })}
          className="border border-foreground/25 px-5 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          New project
        </button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="eyebrow py-10">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="rule-t py-10 text-sm text-muted-foreground">
            No projects yet. Create the first case study.
          </p>
        ) : (
          <ul className="rule-t">
            {projects.map((project) => (
              <li key={project.id} className="rule-b flex flex-wrap items-center gap-4 py-5">
                <span className="w-10 text-xs text-muted-foreground">
                  {String(project.display_order ?? 0).padStart(2, "0")}
                </span>
                <div className="min-w-48 flex-1">
                  <p className="text-base">{project.title}</p>
                  <p className="text-xs text-muted-foreground">/{project.slug}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {project.published ? "Published" : "Draft"}
                  {project.featured ? " · Featured" : ""}
                </span>
                <div className="flex gap-4 text-xs">
                  <button onClick={() => togglePublish.mutate(project)} className="link-underline">
                    {project.published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => setDraft(toDraft(project))} className="link-underline">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete “${project.title}”?`)) remove.mutate(project.id);
                    }}
                    className="link-underline text-accent"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {draft ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate(draft);
          }}
          className="rule-t mt-16 pt-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="display-md">{draft.id ? "Edit project" : "New project"}</h2>
            <button type="button" onClick={() => setDraft(null)} className="link-underline text-sm">
              Cancel
            </button>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Field label="Title">
              <input
                required
                maxLength={140}
                value={draft.title}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    title: e.target.value,
                    slug: draft.id ? draft.slug : slugify(e.target.value),
                  })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Slug">
              <input
                required
                maxLength={80}
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field label="Client">
              <input
                maxLength={140}
                value={draft.client}
                onChange={(e) => setDraft({ ...draft, client: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Industry">
              <input
                maxLength={140}
                value={draft.industry}
                onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Category">
              <input
                maxLength={140}
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Year">
              <input
                maxLength={16}
                value={draft.year}
                onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Services (comma separated)">
              <input
                maxLength={400}
                value={draft.services}
                onChange={(e) => setDraft({ ...draft, services: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Technologies (comma separated)">
              <input
                maxLength={400}
                value={draft.technologies}
                onChange={(e) => setDraft({ ...draft, technologies: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Live URL">
              <input
                type="url"
                maxLength={500}
                value={draft.live_url}
                onChange={(e) => setDraft({ ...draft, live_url: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Display order">
              <input
                type="number"
                value={draft.display_order}
                onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })}
                className={inputClass}
              />
            </Field>

            {(
              [
                ["description", "Overview"],
                ["challenge", "Challenge"],
                ["approach", "Approach"],
                ["solution", "Solution"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label} wide>
                <textarea
                  rows={4}
                  maxLength={4000}
                  value={draft[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            ))}

            <Field label="Hero image" wide>
              <input
                value={draft.hero_image}
                onChange={(e) => setDraft({ ...draft, hero_image: e.target.value })}
                placeholder="Storage path or absolute URL"
                className={inputClass}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files, "hero")}
                className="mt-3 block text-xs text-muted-foreground"
              />
              <HeroPreview path={draft.hero_image} />
            </Field>

            <Field label="Gallery images (one path per line)" wide>
              <textarea
                rows={4}
                value={draft.images}
                onChange={(e) => setDraft({ ...draft, images: e.target.value })}
                className={`${inputClass} resize-none`}
              />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleUpload(e.target.files, "images")}
                className="mt-3 block text-xs text-muted-foreground"
              />
            </Field>

            <Field label="Videos (one path per line)" wide>
              <textarea
                rows={2}
                value={draft.videos}
                onChange={(e) => setDraft({ ...draft, videos: e.target.value })}
                className={`${inputClass} resize-none`}
              />
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleUpload(e.target.files, "videos")}
                className="mt-3 block text-xs text-muted-foreground"
              />
            </Field>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-8">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              />
              Featured on homepage
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />
              Published
            </label>
          </div>

          <button
            type="submit"
            disabled={save.isPending || uploading}
            className="mt-10 border border-foreground/25 px-6 py-3 text-sm transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {uploading ? "Uploading…" : save.isPending ? "Saving…" : "Save project"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
