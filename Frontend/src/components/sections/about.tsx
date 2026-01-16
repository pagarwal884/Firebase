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
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-100 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-l from-purple-100 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

        {/* Section Heading */}
        <div className="text-center max-w-4xl mx-auto relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-headline text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              About Data Intern
            </span>
          </h1>
          
          <p className="mt-8 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Data Intern is a premier internship platform dedicated to bridging the gap between academic 
            knowledge and industry requirements. We empower students and fresh graduates with real-world 
            experience through structured, mentor-guided programs.
          </p>
        </div>

        {/* Focus Areas Card */}
        <div className="mt-24 max-w-7xl mx-auto relative">
          <Card className="shadow-2xl border-0 overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-10 px-8 md:px-12">
              <CardTitle className="text-3xl sm:text-4xl font-bold">
                Our Focus Areas
              </CardTitle>
              <p className="mt-4 text-blue-100 text-lg max-w-2xl">
                Specialized programs designed by industry experts to prepare you for high-demand tech roles
              </p>
            </CardHeader>
            
            <CardContent className="p-8 md:p-12">
              <div className="mb-12">
                <p className="text-gray-700 text-xl leading-relaxed max-w-4xl">
                  We partner with leading tech companies and startups to deliver immersive internship experiences. 
                  Our curriculum is continuously updated to match industry trends and employer expectations.
                </p>
              </div>

              {/* Focus Areas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {focusAreas.map((area) => (
                  <div
                    key={area}
                    className="group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex flex-col h-full">
                      <CheckCircle2 className="w-12 h-12 text-blue-600 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                        {area}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                        Real-world projects and mentorship in {area.toLowerCase()}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          High Demand
                        </span>
                      </div>
                    </div>
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