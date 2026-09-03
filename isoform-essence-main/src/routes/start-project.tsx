import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/site/ContactSection";

const title = "Start a Project — ISOFORM";
const description =
  "Start a project with ISOFORM. Tell us about the brand, the timeline and what success looks like.";

export const Route = createFileRoute("/start-project")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: StartProject,
});

function StartProject() {
  return (
    <div>
      <header className="shell pt-32 pb-16 md:pt-44 md:pb-24">
        <p className="eyebrow">Project Intake</p>
        <h1 className="display-xl mt-6">
          Start a project
          <br />
          <span className="text-accent">Let's shape it.</span>
        </h1>
        <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Tell us about the scope, the timeline, and what success looks like. We review every project enquiry and reply within two working days.
        </p>
      </header>
      <ContactSection heading={false} />
    </div>
  );
}
