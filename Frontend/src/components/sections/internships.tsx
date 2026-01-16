import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Database, AreaChart, Cpu, Globe, Server, Bot } from "lucide-react";
// import { DomainSuggester } from "../domain-suggester";

const domains = [
  {
    icon: <Database className="w-8 h-8 text-primary" />,
    name: "Data Science",
    description: "Build predictive models and extract insights from complex datasets.",
  },
  {
    icon: <AreaChart className="w-8 h-8 text-primary" />,
    name: "Data Analytics",
    description: "Analyze data to identify trends and inform business decisions.",
  },
  {
    icon: <Cpu className="w-8 h-8 text-primary" />,
    name: "Machine Learning",
    description: "Develop intelligent systems that learn from data.",
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    name: "Web Development",
    description: "Create modern, responsive websites and web applications.",
  },
  {
    icon: <Server className="w-8 h-8 text-primary" />,
    name: "Software Development",
    description: "Design, build, and maintain robust software solutions.",
  },
];

export function Internships() {
  return (
    <section id="internships" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Internship Domains</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore a variety of roles across the tech landscape and find the one that fits your passion.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <Card key={domain.name}>
              <CardHeader className="flex flex-row items-center gap-4">
                {domain.icon}
                <CardTitle>{domain.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{domain.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
