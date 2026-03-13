import Link from "next/link";

const productLinks = [
  { href: "/", label: "Home" },
  { href: "/redesign", label: "Redesign Tool" },
  { href: "/dashboard", label: "Dashboard" },
];

const learnLinks = [
  { href: "/learning-hub", label: "Learning Hub" },
  { href: "/learning-hub#research", label: "The Research" },
  { href: "/learning-hub#philosophies", label: "Teaching Philosophies" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer bg-stone-100 border-t border-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">
              Learn
            </h3>
            <ul className="space-y-2">
              {learnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">
              About
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Built with research from Hattie, Thornburg, and MIT TEAL.
              Classroom Redesigner helps educators align physical space with
              pedagogical goals.
            </p>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-stone-500">
            Built for educators.
          </p>
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} Classroom Redesigner
          </p>
        </div>
      </div>
    </footer>
  );
}
