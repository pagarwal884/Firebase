import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Code,
  BrainCircuit,
  Laptop,
} from "lucide-react";

const criteria = [
  {
    icon: GraduationCap,
    title: "Students & Graduates",
    description:
      "Currently enrolled students or recent graduates from any academic background.",
  },
  {
    icon: Code,
    title: "Basic Skills",
    description:
      "Foundational programming, data, or analytical skills are expected.",
  },
  {
    icon: BrainCircuit,
    title: "Passion for Tech",
    description:
      "Strong interest in data science, AI, or software development.",
  },
  {
    icon: Laptop,
    title: "Required Equipment",
    description:
      "A personal laptop and reliable internet connection.",
  },
];

export function Eligibility() {
  return (
    <section
      id="eligibility"
      className="py-20 md:py-28 bg-secondary"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Who Can Apply?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We’re looking for motivated learners who are ready to grow and build
            meaningful tech experience.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {criteria.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="group h-full text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="flex flex-col items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
