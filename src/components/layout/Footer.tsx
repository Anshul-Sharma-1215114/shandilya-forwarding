import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcon";
import { NAV_ITEMS, COMPANY } from "@/data/nav";
import { BRANDS } from "@/data/brands";

export default function Footer() {
  return (
    <footer data-theme="light" className="relative border-t border-ink-900/8 bg-ink-900 text-ink-100">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <CompanyLogo dark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-300">
              Authorized distributor of Zealup Water, Parle Agro and Balaji Wafers products -
              supplying retailers, wholesalers, supermarkets, hotels, restaurants and
              institutions with reliability and efficiency.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: InstagramIcon, href: COMPANY.instagram, label: "Instagram" },
                { icon: FacebookIcon, href: COMPANY.facebook, label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-ink-200 transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-primary-600 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-300 transition-colors duration-300 hover:text-primary-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Our Brands</p>
            <ul className="mt-5 flex flex-col gap-3">
              {BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href="#brands"
                    className="text-sm text-ink-300 transition-colors duration-300 hover:text-primary-300"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="#products"
                  className="text-sm text-ink-300 transition-colors duration-300 hover:text-primary-300"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Contact</p>
            <ul className="mt-5 flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-ink-300">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
                {COMPANY.address}
              </li>
              <li>
                <a
                  href={COMPANY.phoneHref}
                  className="flex items-center gap-3 text-sm text-ink-300 transition-colors duration-300 hover:text-primary-300"
                >
                  <Phone size={16} className="shrink-0 text-primary-400" />
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-3 text-sm text-ink-300 transition-colors duration-300 hover:text-primary-300"
                >
                  <Mail size={16} className="shrink-0 text-primary-400" />
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p>Authorized Distributor — Zealup Water · Parle Agro · Balaji Wafers</p>
        </Container>
      </div>
    </footer>
  );
}
