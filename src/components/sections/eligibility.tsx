import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, Code, BrainCircuit, Laptop } from "lucide-react";

const criteria = [
  {
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
    title: "Students & Graduates",
    description: "Currently enrolled students or recent graduates from any field.",
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "Basic Skills",
    description: "Fundamental programming or analytical skills are required.",
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "Passion for Tech",
    description: "A strong interest in data, AI, or software development.",
  },
  {
    icon: <Laptop className="w-8 h-8 text-primary" />,
    title: "Required Equipment",
    description: "Access to a laptop and a stable internet connection.",
  },
];

export function Eligibility() {
  return (
    <section id="eligibility" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Who Can Apply?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are looking for enthusiastic learners who are eager to make their mark in the tech industry.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {criteria.map((item, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {item.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
