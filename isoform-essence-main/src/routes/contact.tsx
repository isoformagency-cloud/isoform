import { createFileRoute } from "@tanstack/react-router";
import { TeamSection } from "@/components/site/TeamSection";

const title = "Contact — ISOFORM";
const description =
  "Contact ISOFORM. Meet the team and get in touch directly with our makers.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div>
      <header className="shell pt-32 pb-16 md:pt-44 md:pb-24">
        <p className="eyebrow">Contact Us</p>
        <h1 className="display-xl mt-6">
          The people
          <br />
          <span className="text-accent">behind the craft.</span>
        </h1>
        <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          We operate as a close-knit collective of senior makers. Reach out directly to discuss collaborations, questions, or ongoing work.
        </p>
      </header>
      <TeamSection />
    </div>
  );
}
