import { About } from '@/components/sections/about';
import { Apply } from '@/components/sections/apply';
import { Benefits } from '@/components/sections/benefits';
import { Cta } from '@/components/sections/cta';
import { Eligibility } from '@/components/sections/eligibility';
import { Hero } from '@/components/sections/hero';
import { Internships } from '@/components/sections/internships';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const backendurl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Eligibility />
        <Benefits />
        <Internships />
        <Apply />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
