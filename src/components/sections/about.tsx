import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const focusAreas = [
    'Data Science & AI',
    'Data Analytics',
    'Web Development',
    'Software Engineering',
];

export function About() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">About Data Intern</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Data Intern is a private internship platform dedicated to helping students and fresh graduates gain hands-on industry experience and launch their careers in technology.
            </p>
        </div>
        <div className="mt-12">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Our Focus</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">We partner with leading tech companies to provide high-quality internships in high-demand fields. Our goal is to bridge the gap between academic learning and real-world application.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {focusAreas.map((area) => (
                            <div key={area} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span className="font-medium">{area}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
