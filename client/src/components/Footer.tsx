import { Link } from "wouter";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t bg-card/50 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <img
              src="/logo.png"
              alt="AI Learning Curve"
              style={{ height: "80px" }}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground">
              Empowering the next generation of AI practitioners through
              comprehensive, interactive learning paths.
            </p>
          </div>

          {/* Learning Paths */}
          <div>
            <h3 className="font-semibold mb-4">Learning Paths</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/paths" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AI Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/paths" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/paths" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Deep Learning
                </Link>
              </li>
              <li>
                <Link href="/paths" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Natural Language Processing
                </Link>
              </li>
              <li>
                <Link href="/paths" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Computer Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/paths" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Learning Paths
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@ailearningcurve.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Have questions? Reach out to us anytime.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} AI Learning Curve. All rights reserved.
            Empowering the next generation of AI practitioners.
          </p>
        </div>
      </div>
    </footer>
  );
}
