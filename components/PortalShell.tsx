import Link from "next/link";
import { company } from "@/lib/company";

type PortalShellProps = {
  title: string;
  role: string;
  userName: string;
  children: React.ReactNode;
};

export default function PortalShell({
  title,
  role,
  userName,
  children,
}: PortalShellProps) {
  return (
    <div className="portal">
      <aside className="portalSidebar">
        <Link className="logo" href="/">
          <span className="logoMark">MR</span>
          {company.name}
        </Link>
        <div className="portalIdentity">
          <span>{role}</span>
          <strong>{userName}</strong>
        </div>
        <nav>
          <Link href={`/${role.toLowerCase()}`}>Overview</Link>
          {role === "ADMIN" && <Link href="/admin#leads">Lead pipeline</Link>}
          {role === "ADMIN" && <Link href="/admin#proposals">Proposals</Link>}
          {role === "STUDENT" && <Link href="/training">Course catalog</Link>}
          {role === "CLIENT" && <Link href="/contact">Request support</Link>}
        </nav>
        <form action="/api/auth/logout" method="post">
          <button type="submit">Sign out</button>
        </form>
      </aside>
      <main className="portalMain">
        <header className="portalHeader">
          <div>
            <p className="eyebrow">{role} workspace</p>
            <h1>{title}</h1>
          </div>
          <Link className="secondaryPortalBtn" href="/">
            View website
          </Link>
        </header>
        {children}
      </main>
    </div>
  );
}
