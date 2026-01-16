import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Database,
  AreaChart,
  Cpu,
  Globe,
  Server,
} from "lucide-react";

const domains = [
  {
    icon: Database,
    name: "Data Science",
    description:
      "Build predictive models and extract meaningful insights from complex datasets.",
  },
  {
    icon: AreaChart,
    name: "Data Analytics",
    description:
      "Analyze data to uncover trends and support data-driven decisions.",
  },
  {
    icon: Cpu,
    name: "Machine Learning",
    description:
      "Design intelligent systems that learn, adapt, and improve from data.",
  },
  {
    icon: Globe,
    name: "Web Development",
    description:
      "Create modern, responsive websites and scalable web applications.",
  },
  {
    icon: Server,
    name: "Software Development",
    description:
      "Design, build, and maintain reliable, production-ready software.",
  },
];

export function Internships() {
  return (
    <section
      id="internships"
      className="py-20 md:py-28 bg-secondary"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Internship Domains
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore focused internship tracks and choose the domain that aligns
            with your interests and career goals.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card
                key={domain.name}
                className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="flex flex-col items-start gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {domain.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {domain.description}
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
