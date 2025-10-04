import { Link } from "react-router-dom";
import { Youtube, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-background/40 py-16 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="motion-safe:animate-fade-up">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Network Academy</h3>
            <p className="text-sm text-muted-foreground">
              Master networking through comprehensive video tutorials and hands-on practice.
            </p>
          </div>

          <div className="motion-safe:animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h4 className="mb-4 font-semibold text-foreground">Learn</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/#curriculum" className="transition-colors hover:text-primary">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link to="/#videos" className="transition-colors hover:text-primary">
                  Video Library
                </Link>
              </li>
              <li>
                <Link to="/courses" className="transition-colors hover:text-primary">
                  Practice Labs
                </Link>
              </li>
              <li>
                <Link to="/courses" className="transition-colors hover:text-primary">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div className="motion-safe:animate-fade-up" style={{ animationDelay: "0.18s" }}>
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/#features" className="transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="transition-colors hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/courses" className="transition-colors hover:text-primary">
                  For Teams
                </Link>
              </li>
              <li>
                <a href="mailto:hello@networkacademy.ke" className="transition-colors hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="motion-safe:animate-fade-up" style={{ animationDelay: "0.26s" }}>
            <h4 className="mb-4 font-semibold text-foreground">Connect</h4>
            <div className="flex gap-3">
              {[{
                href: "https://youtube.com/@networkacademy",
                icon: Youtube,
                label: "YouTube",
              }, {
                href: "https://twitter.com/networkacademy",
                icon: Twitter,
                label: "Twitter",
              }, {
                href: "https://linkedin.com/company/networkacademy",
                icon: Linkedin,
                label: "LinkedIn",
              }, {
                href: "mailto:hello@networkacademy.ke",
                icon: Mail,
                label: "Email",
              }].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noreferrer"}
                  className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Network Academy. All rights reserved. Built for Kenya 🇰🇪</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
