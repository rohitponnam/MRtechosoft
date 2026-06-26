import Link from "next/link";
import { company } from "@/lib/company";

function SocialIcon({ name }: { name: string }) {
  if (name === "WhatsApp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.5 23.5l5.9-1.6A11.8 11.8 0 0 0 12 23.3h.1A11.8 11.8 0 0 0 20.5 3.5ZM12.1 21.3a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.5.9.9-3.4-.2-.4A9.8 9.8 0 1 1 12 21.3h.1Zm5.4-7.3c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2l-.9 1c-.2.3-.4.3-.7.1a8 8 0 0 1-2.4-1.5A9 9 0 0 1 9.1 11c-.2-.3 0-.5.1-.7l.5-.5.3-.6c.1-.2 0-.4 0-.6l-1-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.1.2 2.4 3.7 5.8 5.2.8.4 1.4.6 1.9.7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z" />
      </svg>
    );
  }

  if (name === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 8.2H3.2V20h3.3V8.2ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM20.8 13.2c0-3.6-1.9-5.3-4.5-5.3-2.1 0-3 1.1-3.5 1.9V8.2H9.5V20h3.3v-5.8c0-1.5.3-3 2.2-3 1.9 0 1.9 1.8 1.9 3.1V20h3.3l.6-6.8Z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.1 2A3.1 3.1 0 0 0 4 7.1v9.8A3.1 3.1 0 0 0 7.1 20h9.8a3.1 3.1 0 0 0 3.1-3.1V7.1A3.1 3.1 0 0 0 16.9 4H7.1Zm10.4 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    );
  }

  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.2 22v-8.8h3l.4-3.4h-3.4V7.6c0-1 .3-1.7 1.7-1.7h1.8v-3c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2.4h-3v3.4h3V22h3.7Z" />
      </svg>
    );
  }

  if (name === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.3l7.3-8.4L2.9 2h6.3l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4H6.5l11.3 15.8Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container">
        <div className="footerTop">
          <div>
            <Link className="logo" href="/">
              <span className="logoMark">MR</span>
              {company.name}
            </Link>
            <p className="footerCopy">
              Cybersecurity consulting, identity protection, governance, and
              technology advisory built for resilient organizations.
            </p>
            <div className="footerContact">
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
              <span>{company.address}</span>
            </div>
          </div>
        </div>
        <div className="socialLinks" aria-label="Social media">
          {company.social.map((social) => (
            <a
              href={social.href}
              key={social.name}
              target="_blank"
              rel="noreferrer"
              aria-label={`${company.name} on ${social.name}`}
              title={social.name}
            >
              <SocialIcon name={social.name} />
            </a>
          ))}
        </div>
        <div className="footerBottom">
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
