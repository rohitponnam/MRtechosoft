import type { Metadata } from "next";
import Chatbot from "@/components/Chatbot";
import "./globals.css";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: {
    default: `${company.name} | Software, AI & Talent`,
    template: `%s | ${company.name}`,
  },
  description:
    "Cybersecurity consulting, identity and access management, governance, risk, compliance, next-gen security, and IT advisory.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
