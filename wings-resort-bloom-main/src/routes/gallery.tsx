import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { GALLERY_IMAGES, GalleryItem } from "@/lib/data";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import lounge from "@/assets/about-lobby.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — Wings Resort Ooty" },
      {
        name: "description",
        content:
          "Take a visual journey through Wings Resort: hand-built chalets, heritage lounges, and misty mountain views.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  useReveal();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", label: "All Photos" },
    { id: "cottages", label: "Cottages & Chalets" },
    { id: "interiors", label: "Suites & Lounge" },
    { id: "landscape", label: "Landscape & Grounds" },
  ];

  const filteredImages =
    activeCategory === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const openLightbox = (image: GalleryItem) => {
    const index = filteredImages.findIndex((img) => img.src === image.src);
    setSelectedImageIndex(index !== -1 ? index : 0);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + filteredImages.length) % filteredImages.length,
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar transparentOnTop={true} />
      <PageHeader
        eyebrow="Visual Tour"
        title="Wander the property."
        subtitle="Glimpses of quiet life at Wings Resort across misty dawns, glowing fires, and sunlit tea terraces."
        backgroundImage={lounge}
      />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          {/* Category Filter Pills */}
          <div className="reveal flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[240px]">
            {filteredImages.map((im, i) => (
              <div
                key={im.title + i}
                onClick={() => openLightbox(im)}
                className={`reveal group relative cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 hover:shadow-lg ${
                  im.span && activeCategory === "all" ? im.span : ""
                }`}
              >
                <img
                  src={im.src}
                  alt={im.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">
                    {im.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm md:text-base">{im.title}</p>
                    <Maximize2 className="h-4 w-4 opacity-75" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close photo preview"
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={prevImage}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filteredImages[selectedImageIndex].src}
              alt={filteredImages[selectedImageIndex].alt}
              className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="font-display text-lg">
                {filteredImages[selectedImageIndex].title}
              </h3>
              <p className="text-xs text-white/70">
                {filteredImages[selectedImageIndex].alt} (Photo {selectedImageIndex + 1} of{" "}
                {filteredImages.length})
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
