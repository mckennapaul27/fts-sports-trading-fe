"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Squash as Hamburger } from "hamburger-react";

export function NavbarTouch() {
  const [isOpen, setOpen] = useState(false);

  return (
    <nav className="xl:hidden bg-dark-navy border-b border-gold/20">
      <div className="container mx-auto flex items-center justify-between px-6 sm:px-8 xl:px-12 py-4">
        <Link href="/" className="flex-shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/logo-white-text.svg"
            alt="Logo"
            width={140}
            height={29}
            priority
          />
        </Link>

        <Hamburger
          toggled={isOpen}
          toggle={setOpen}
          color="var(--color-cream)"
        />
      </div>

      {isOpen && (
        <div className="container px-6 sm:px-8 xl:px-12 pb-6 space-y-4">
          <Link
            href="/"
            className="block text-white hover:text-gold transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/results"
            className="block text-white hover:text-gold transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Results
          </Link>
          <Link
            href="/methodology"
            className="block text-white hover:text-gold transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Methodology
          </Link>
          <Link
            href="/education"
            className="block text-white hover:text-gold transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Education
          </Link>
          <Link
            href="/blog"
            className="block text-white hover:text-gold transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/systems"
            className="block text-white hover:text-gold transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Systems
          </Link>
          <div className="pt-4 space-y-3 border-t border-gold/20">
            <Link
              href="/sign-in"
              className="block text-white hover:text-gold transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/membership" onClick={() => setOpen(false)}>
                Join now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
