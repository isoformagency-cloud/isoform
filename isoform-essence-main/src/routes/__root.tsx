import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Cursor } from "@/components/site/Cursor";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="shell flex min-h-screen flex-col justify-center">
      <p className="eyebrow">404</p>
      <h1 className="display-xl mt-6">Lost form</h1>
      <p className="mt-6 max-w-md text-sm text-muted-foreground">
        This page doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/" className="link-underline text-sm">
          Back to ISOFORM
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="shell flex min-h-screen flex-col justify-center">
      <p className="eyebrow">Error</p>
      <h1 className="display-lg mt-6">This page didn't load</h1>
      <div className="mt-8 flex flex-wrap gap-6 text-sm">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="link-underline"
        >
          Try again
        </button>
        <a href="/" className="link-underline">
          Go home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ISOFORM — Independent Digital Studio" },
      {
        name: "description",
        content:
          "ISOFORM is an independent digital studio creating distinctive websites and experiences for ambitious brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isStudio = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll />
      {!isStudio ? <Cursor /> : null}
      {!isStudio ? <Nav /> : null}
      <main id="main" className="grain min-h-screen">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      {!isStudio ? <Footer /> : null}
      <Toaster />
    </QueryClientProvider>
  );
}
