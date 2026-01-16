import { Logo } from "../logo";
import { Linkedin, Twitter, Github } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { name: "Github", icon: Github, url: "#" },
  { name: "Twitter", icon: Twitter, url: "#" },
  { name: "LinkedIn", icon: Linkedin, url: "#" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Connecting students with real-world internships in data science,
              analytics, web development, and modern tech roles.
            </p>

            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#internships" className="text-muted-foreground hover:text-foreground">
                  Internships
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-muted-foreground hover:text-foreground">
                  Benefits
                </a>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Domains */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Internship Domains
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Data Science</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Data Analytics</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Machine Learning</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Web Development</a></li>
              <li><a href="#internships" className="text-muted-foreground hover:text-foreground">Software Development</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contact@dataintern.co</li>
              <li>+1 234 567 8900</li>
              <li>123 Tech Park, Silicon Valley, CA</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          © 2026 Data Intern. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
