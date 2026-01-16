import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = PlaceHolderImages[0];

  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={heroImage.imageUrl}
        alt={heroImage.description}
        fill
        priority
        className="object-cover"
        data-ai-hint={heroImage.imageHint}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            Launch Your Career in Data & Tech
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
            Data Intern connects ambitious students with real-world internships
            in data science, analytics, web development, and modern tech roles.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="px-10 py-6 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <a href="#apply">Apply for Internship</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
