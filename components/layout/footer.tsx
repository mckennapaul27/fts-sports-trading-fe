import Link from "next/link";
import Image from "next/image";

function FacebookIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95718 14.8821 3.28445C14.0247 3.61173 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.802C15.2063 14.5518 14.5932 15.1639 13.8416 15.5523C13.0901 15.9407 12.2384 16.0859 11.4078 15.9654C10.5771 15.8449 9.80976 15.4647 9.21484 14.8698C8.61992 14.2748 8.2397 13.5075 8.11919 12.6769C7.99868 11.8462 8.14388 10.9946 8.53229 10.243C8.9207 9.49138 9.53279 8.87831 10.2826 8.49078C11.0324 8.10324 11.8824 7.96112 12.7146 8.08452C13.5555 8.20887 14.3338 8.59218 14.9367 9.18504C15.5396 9.7779 15.9229 10.5562 16.0473 11.3971L16 11.37Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M22 6L12 13L2 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const quickLinks = [
  { label: "Results", href: "/results" },
  { label: "Methodology", href: "/methodology" },
  { label: "Membership", href: "/membership" },
  { label: "About", href: "/about" },
];

const resources = [
  { label: "Education", href: "/education" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const legal = [
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Risk Disclaimer", href: "/risk-disclaimer" },
];

export function Footer() {
  return (
    <footer
      className="bg-dark-navy text-white"
      style={{ background: "var(--color-gradient)" }}
    >
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="py-12 sm:py-16">
            {/* Main Footer Content */}
            <div className="flex flex-col lg:flex-row lg:justify-between gap-16 lg:gap-12 mb-8">
              {/* Left Column - Logo and Social */}
              <div className="flex-shrink-0">
                <Link href="/" className="inline-block mb-4">
                  <Image
                    src="/logo-white-text.svg"
                    alt="Fortis Sports Trading"
                    width={180}
                    height={38}
                  />
                </Link>
                <p className="text-gray-300 text-base mb-6">
                  Disciplined sports trading, proven in public.
                </p>
                {/* Social Media Icons */}
                <div className="flex items-center gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gold transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gold transition-colors"
                    aria-label="Twitter"
                  >
                    <TwitterIcon />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gold transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="mailto:contact@fortissportstrading.com"
                    className="text-white hover:text-gold transition-colors"
                    aria-label="Email"
                  >
                    <EmailIcon />
                  </a>
                </div>
              </div>

              {/* Right Columns - Links */}
              <div className="flex flex-col sm:flex-row justify-between gap-8 lg:gap-12 flex-grow max-w-2xl">
                {/* Quick Links */}
                <div>
                  <h3 className="font-bold text-white mb-4">Quick Links</h3>
                  <ul className="space-y-3">
                    {quickLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors text-base"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="font-bold text-white mb-4">Resources</h3>
                  <ul className="space-y-3">
                    {resources.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors text-base"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="font-bold text-white mb-4">Legal</h3>
                  <ul className="space-y-3">
                    {legal.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors text-base"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-teal/30 pt-8 mt-8">
              <p className="text-center text-gray-300 text-sm mb-4">
                © {new Date().getFullYear()} Fortis Sports Trading. All rights
                reserved.
              </p>
              <p className="text-center text-gray-400 text-sm">
                Website design & custom software by{" "}
                <a
                  href="https://www.bunkerdigital.co.uk/services/custom-software-for-small-business"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gold transition-colors"
                >
                  BunkerDigital
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
