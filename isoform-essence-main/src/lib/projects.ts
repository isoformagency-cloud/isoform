import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInput = Database["public"]["Tables"]["projects"]["Insert"];

export const publishedProjectsQuery = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const projectBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["projects", "slug", slug],
    queryFn: async (): Promise<Project | null> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
  });

export const allProjectsQuery = queryOptions({
  queryKey: ["projects", "all"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
