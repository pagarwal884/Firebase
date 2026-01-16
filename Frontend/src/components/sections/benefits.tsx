import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  Award,
  DollarSign,
  Linkedin,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: Briefcase,
    title: "Real-World Experience",
    description: "Work on live projects and solve real business problems.",
  },
  {
    icon: Users,
    title: "Industry Mentorship",
    description: "Get guidance and support from experienced professionals.",
  },
  {
    icon: Award,
    title: "Certificate of Internship",
    description: "Receive a verified certificate to validate your experience.",
  },
  {
    icon: DollarSign,
    title: "Stipend & Rewards",
    description: "Earn a stipend and performance-based rewards for your work.",
  },
  {
    icon: Linkedin,
    title: "Profile Enhancement",
    description: "Boost your resume and LinkedIn profile with valuable experience.",
  },
  {
    icon: ShieldCheck,
    title: "Career Opportunities",
    description: "Get interview opportunities and full-time job offers.",
  },
];

export function Benefits() {
  return (
    <section
      id="benefits"
      className="relative py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Why Join Data Intern?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our internships are built to give you practical exposure, real
            mentorship, and a clear career edge.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="flex flex-col items-start gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg leading-snug">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
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
