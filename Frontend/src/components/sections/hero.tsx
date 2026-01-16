import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages[0];
  return (
    <section id="home" className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center">
        <Image 
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
        />
        <div className="absolute inset-0 bg-black/50" />
      <div className="relative container z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            Data Intern – Launch Your Career in Data & Tech
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/90 md:text-xl">
            A private platform connecting students with real-world internships in data science, analytics, web development, and tech roles.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <a href="#apply">Apply for Internship</a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
