import Link from "next/link";
import { getCurrentUser, roleHome } from "@/lib/auth";

export default async function PaymentSuccessPage() {
  const user = await getCurrentUser();
  return (
    <main className="centeredState">
      <span className="successIcon">✓</span>
      <p className="eyebrow">Payment complete</p>
      <h1>Everything is confirmed.</h1>
      <p>Your portal has been updated with the latest payment status.</p>
      <Link className="primaryBtn" href={roleHome(user?.role)}>
        Return to portal
      </Link>
    </main>
  );
}
