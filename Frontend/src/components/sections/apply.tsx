import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const steps = [
  {
    step: 1,
    title: "Register on Data Intern",
    description: "Create your account to start your journey with us.",
  },
  {
    step: 2,
    title: "Complete Your Profile",
    description: "Fill out your details and upload your resume to get noticed.",
  },
  {
    step: 3,
    title: "Choose Internship Domain",
    description: "Select the domain that aligns with your career goals.",
  },
  {
    step: 4,
    title: "Submit Application",
    description: "Apply to the internship programs that interest you the most.",
  },
  {
    step: 5,
    title: "Get Shortlisted & Onboarded",
    description: "Successful candidates will be contacted for the next steps.",
  },
];

export function Apply() {
  return (
    <section id="apply" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">How to Apply</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Follow these simple steps to start your internship journey with Data Intern.
          </p>
        </div>

        <div className="relative mt-12">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" aria-hidden="true" />

            <div className="space-y-8">
                {steps.map((step, index) => (
                    <div key={step.step} className="relative flex items-center justify-center">
                        <div className="md:w-1/2 flex md:justify-end md:pr-8">
                            <Card className={`w-full md:max-w-md ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                            {step.step}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{step.title}</h3>
                                            <p className="text-muted-foreground text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                         <div className="hidden md:block absolute w-4 h-4 rounded-full bg-primary border-2 border-background left-1/2 -translate-x-1/2" aria-hidden="true" />
                        <div className="md:w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-12 text-center">
            <Button size="lg" asChild>
                <Link href="/register">Get Started Now</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
