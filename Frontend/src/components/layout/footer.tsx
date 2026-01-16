import { Logo } from '../logo';
import { Linkedin, Twitter, Github } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
    { name: 'Github', icon: Github, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Connecting students with real-world internships in data science, analytics, web development, and tech roles.
            </p>
            <div className="flex space-x-4">
                {socialLinks.map((link) => (
                    <a key={link.name} href={link.url} className="text-muted-foreground hover:text-foreground">
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.name}</span>
                    </a>
                ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-muted-foreground hover:text-foreground">About</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Internships</a></li>
              <li><a href="#benefits" className="text-muted-foreground hover:text-foreground">Benefits</a></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-foreground">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Internship Domains</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Data Science</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Data Analytics</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Machine Learning</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Web Development</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Software Development</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contact@dataintern.co</li>
              <li>+1 234 567 8900</li>
              <li>123 Tech Park, Silicon Valley, CA</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 Data Intern. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
