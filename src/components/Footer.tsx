import { Link } from "react-router-dom";
import { Youtube, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">Network Academy</h3>
            <p className="text-sm text-muted-foreground">
              Master networking through comprehensive video tutorials and hands-on practice.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#curriculum" className="text-muted-foreground transition-colors hover:text-primary">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link to="/#videos" className="text-muted-foreground transition-colors hover:text-primary">
                  Video Library
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-muted-foreground transition-colors hover:text-primary">
                  Practice Labs
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-muted-foreground transition-colors hover:text-primary">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#features" className="text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-muted-foreground transition-colors hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-muted-foreground transition-colors hover:text-primary">
                  For Teams
                </Link>
              </li>
              <li>
                <a href="mailto:hello@networkacademy.ke" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://youtube.com/@networkacademy"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/networkacademy"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/networkacademy"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@networkacademy.ke"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Network Academy. All rights reserved. Built for Kenya 🇰🇪</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
