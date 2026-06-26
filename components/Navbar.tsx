import Link from "next/link";
import { company } from "@/lib/company";

const links = [
  ["Services", "/services"],
  ["Training", "/training"],
  ["Placements", "/placements"],
  ["AI Products", "/ai-products"],
  ["Contact", "/contact"],
  ["Portal", "/login"],
];

export default function Navbar() {
  return (
    <header className="siteHeader">
      <nav className="nav container" aria-label="Primary navigation">
        <Link className="logo" href="/" aria-label={`${company.name} home`}>
          <span className="logoMark">MR</span>
          {company.name}
        </Link>
        <div className="navLinks">
          {links.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
        <Link className="primaryBtn" href="/contact">
          Book a call
        </Link>
      </nav>
    </header>
  );
}
