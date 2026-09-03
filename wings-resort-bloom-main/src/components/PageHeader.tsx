import heroImg from "@/assets/hero-resort.jpg";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  backgroundImage = heroImg,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-primary pt-32 pb-20 md:pt-40 md:pb-28 text-white">
      <img
        src={backgroundImage}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/95" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <p className="reveal text-xs uppercase tracking-[0.35em] text-secondary">
          {eyebrow}
        </p>
        <h1 className="reveal mt-3 font-display text-4xl sm:text-5xl md:text-6xl text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="reveal mt-4 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
