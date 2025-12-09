import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function NavbarDesktop() {
  return (
    <nav className="hidden xl:flex bg-dark-navy">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between ">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-white-text.svg"
              alt="Logo"
              width={180}
              height={37}
              priority
            />
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-white hover:text-gold transition-colors"
            >
              Home
            </Link>
            <Link
              href="/results"
              className="text-white hover:text-gold transition-colors"
            >
              Results
            </Link>
            <Link
              href="/methodology"
              className="text-white hover:text-gold transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/education"
              className="text-white hover:text-gold transition-colors"
            >
              Education
            </Link>
            <Link
              href="/blog"
              className="text-white hover:text-gold transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/systems"
              className="text-white hover:text-gold transition-colors"
            >
              Systems
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-white hover:text-gold transition-colors"
            >
              Sign in
            </Link>
            <Button variant="secondary" asChild>
              <Link href="/register">Join now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
