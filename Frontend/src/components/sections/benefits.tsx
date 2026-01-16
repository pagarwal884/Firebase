import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Award, DollarSign, Linkedin, ShieldCheck } from "lucide-react";

const benefits = [
    {
        icon: <Briefcase className="w-8 h-8 text-primary" />,
        title: "Real-World Experience",
        description: "Work on live projects and solve real business problems.",
    },
    {
        icon: <Users className="w-8 h-8 text-primary" />,
        title: "Industry Mentorship",
        description: "Get guidance and support from experienced professionals.",
    },
    {
        icon: <Award className="w-8 h-8 text-primary" />,
        title: "Certificate of Internship",
        description: "Receive a verified certificate to validate your experience.",
    },
    {
        icon: <DollarSign className="w-8 h-8 text-primary" />,
        title: "Stipend & Rewards",
        description: "Earn a stipend and performance-based rewards for your work.",
    },
    {
        icon: <Linkedin className="w-8 h-8 text-primary" />,
        title: "Profile Enhancement",
        description: "Boost your resume and LinkedIn profile with valuable experience.",
    },
     {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Career Opportunities",
        description: "Get interview opportunities and full-time job offers.",
    },
];

export function Benefits() {
    return (
        <section id="benefits" className="py-16 md:py-24">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Why Join Data Intern?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our internships are designed to provide a comprehensive learning experience and accelerate your career growth.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                {benefit.icon}
                                <CardTitle>{benefit.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
