import { Button } from "@/components/ui/button";
import Link from 'next/link';

export function Cta() {
  return (
    <section id="cta" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Start Your Internship Journey with Data Intern
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Ready to gain real-world experience and boost your career? Register today and unlock a world of opportunities.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Register Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
