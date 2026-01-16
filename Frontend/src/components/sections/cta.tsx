import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Cta() {
  return (
    <section
      id="cta"
      className="relative py-20 md:py-28 bg-primary text-primary-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Start Your Internship Journey with Data Intern
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-primary-foreground/80">
            Gain real-world experience, work with industry mentors, and take a
            serious step toward your career goals. No fluff, just impact.
          </p>

          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-10 py-6 text-base font-semibold"
              asChild
            >
              <Link href="/register">Register Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
