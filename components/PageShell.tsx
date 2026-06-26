import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function PageShell({
  eyebrow,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <>
      <Navbar />
      <main>
        <section className="pageHero">
          <div className="container">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>
        <div className="pageContent">{children}</div>
      </main>
      <Footer />
    </>
  );
}
