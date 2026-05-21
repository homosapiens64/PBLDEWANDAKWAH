import Link from "next/link";

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.5v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.07 1.8.07v2h-1c-1 0-1.3.62-1.3 1.2V12h2.3l-.37 3h-1.93v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.2" fill="#16a085" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 5.92c-.66.3-1.37.5-2.12.6.76-.45 1.34-1.17 1.61-2.03-.71.42-1.5.72-2.34.89A4.03 4.03 0 0 0 12.3 9.9c0 .32.03.63.1.93-3.36-.17-6.34-1.78-8.34-4.23-.35.6-.56 1.3-.56 2.05 0 1.42.72 2.67 1.81 3.4-.67-.02-1.3-.2-1.85-.5v.05c0 1.98 1.42 3.63 3.3 4-.35.1-.72.15-1.1.15-.27 0-.54-.03-.8-.08.54 1.72 2.1 2.97 3.95 3.01A8.12 8.12 0 0 1 2 19.54a11.47 11.47 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68v-.53c.8-.58 1.5-1.3 2.05-2.12-.74.33-1.54.56-2.36.66z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 0 4.96 8 2.5 2.5 0 0 0 4.98 3.5zM3 9h3.96V21H3zM9.5 9H13v1.71c.54-.9 1.72-1.71 3.54-1.71 3.78 0 4.5 2.49 4.5 5.73V21H17v-5.04c0-1.2-.02-2.75-1.68-2.75-1.68 0-1.94 1.31-1.94 2.66V21H9.5z" />
    </svg>
  );
}

const menuLeft = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/Berita/Terkini" },
  { label: "Kajian", href: "/Kajian" },
  { label: "Konsultasi", href: "/Konsultasi" },
  { label: "Pendidikan", href: "/TentangKami/Pendidikan" },
  { label: "Tentang Kami", href: "/TentangKami/Profile" },
];

const menuRight = [
  { label: "Our Partners", href: "/partners" },
  { label: "Buy a T-shirt", href: "/tshirt" },
  { label: "Adopt an Animal", href: "/adopt" },
  { label: "Donate", href: "/donate" },
];

const socialLinks = [
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-teal-500 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          {/* Branding */}
          <div className="space-y-4">
            <h2 className="text-yellow-400 font-bold text-xl leading-tight uppercase tracking-wide">
              Dewan Da&apos;wah Islamiyah
              <br />
              Indonesia Kota Semarang
            </h2>
            <div className="space-y-1 text-sm text-white/90">
              <p>
                <a
                  href="mailto:dewanda'wahislamiyahsemarang@gmail.com"
                  className="hover:text-yellow-300 transition-colors duration-200 break-all"
                >
                  dewanda&apos;wahislamiyahsemarang@gmail.com
                </a>
              </p>
              <p>15Th Street Avenue, New York, USA</p>
              <p>011-554-8798-6556</p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-300 transition-colors duration-200"
                >
                  <Icon />
                </a>
              ))}
              {/* Skype & Dribbble icons (lucide doesn't have them, use SVG placeholders) */}
              <a
                href="#"
                aria-label="Skype"
                className="text-white hover:text-yellow-300 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.197 10.473a9.57 9.57 0 0 0-8.67-8.67A5.5 5.5 0 0 0 2.5 6.5a5.45 5.45 0 0 0 .803 2.843A9.57 9.57 0 0 0 11.97 22a5.5 5.5 0 0 0 5.357-6.773 9.565 9.565 0 0 0 4.87-4.754Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Dribbble"
                className="text-white hover:text-yellow-300 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
                </svg>
              </a>
            </div>
          </div>

          {/* Menu Left */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-white">
              Menu
            </h3>
            <ul className="space-y-2">
              {menuLeft.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/90 hover:text-yellow-300 text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Right (col 3) */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-white">
              Menu
            </h3>
            <ul className="space-y-2">
              {menuRight.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/90 hover:text-yellow-300 text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Right (col 4 — duplicate as in design) */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-white">
              &nbsp;
            </h3>
            <ul className="space-y-2">
              {menuRight.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/90 hover:text-yellow-300 text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-white/80">
          <p>©2026 DDI Semarang Organization All Rights Reserved.</p>
          <p>
            Design by{" "}
            <a
              href="#"
              className="underline hover:text-yellow-300 transition-colors duration-200"
            >
              IK-2A Polines
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
