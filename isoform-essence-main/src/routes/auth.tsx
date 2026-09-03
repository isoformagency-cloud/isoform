import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const title = "Studio access — ISOFORM";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "ISOFORM studio dashboard sign in." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: "ISOFORM studio dashboard sign in." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(event.currentTarget).entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }

    setPending(true);
    const { email, password } = parsed.data;
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setPending(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    if (result.data.session) {
      navigate({ to: "/admin", replace: true });
    } else {
      toast.success("Check your inbox to confirm the address.");
    }
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="shell flex min-h-screen items-center py-24">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="eyebrow link-underline">
          ← ISOFORM
        </Link>
        <h1 className="display-lg mt-8">Studio access</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Restricted to ISOFORM administrators.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
          <div>
            <label htmlFor="email" className="eyebrow">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full border-b border-input bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="eyebrow">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              className="mt-2 w-full border-b border-input bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full border border-foreground/25 py-3 text-sm transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {pending ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={onGoogle}
          className="mt-4 w-full border border-foreground/15 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="link-underline mt-8 text-xs text-muted-foreground"
        >
          {mode === "signin" ? "Need an account?" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}
