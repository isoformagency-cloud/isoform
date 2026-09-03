import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Philosophy } from "@/components/site/Philosophy";
import { Capabilities } from "@/components/site/Capabilities";
import { FeaturedWork } from "@/components/site/FeaturedWork";
import { StudioStatement } from "@/components/site/StudioStatement";
import { ContactSection } from "@/components/site/ContactSection";
import { Intro } from "@/components/site/Intro";

const title = "ISOFORM — Independent Digital Studio";
const description =
  "ISOFORM is an independent digital studio creating distinctive websites, interfaces and digital experiences for ambitious brands.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <Philosophy />
      <Capabilities />
      <FeaturedWork />
      <StudioStatement />
      <ContactSection />
    </>
  );
}
