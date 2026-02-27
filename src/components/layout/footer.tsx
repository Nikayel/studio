import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
              <span className="text-lg font-bold">Diaspora Bridge</span>
            </div>
            <p className="mt-3 text-sm text-primary-foreground/70">
              100% of every donation is hand-delivered to Afghan families for
              girls&apos; education. No middlemen, no overhead.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="mt-3 flex flex-col gap-2">
              <Link
                href="/profiles"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                Browse Profiles
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                How It Works
              </Link>
              <Link
                href="/#faq"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                FAQ
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold">Follow the Journey</h3>
            <nav className="mt-3 flex flex-col gap-2">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                Instagram
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                TikTok
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
              >
                YouTube
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/50">
          &copy; {new Date().getFullYear()} Diaspora Bridge. Built with love
          for Afghan girls&apos; education.
        </div>
      </div>
    </footer>
  );
}
