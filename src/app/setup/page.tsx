import { redirect } from "next/navigation";
import { hasAdmin } from "@/lib/users";
import SetupForm from "../ui/SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const exists = await hasAdmin();
  if (exists) redirect("/");
  return (
    <main className="shell">
      <section className="card">
        <header className="card__header">
          <div className="brand">
            <div className="brand__mark" aria-hidden="true">
              BT
            </div>
            <div>
              <h1 className="brand__title">Admin setup</h1>
              <p className="brand__subtitle">Create the first admin account</p>
            </div>
          </div>
        </header>
        <SetupForm />
      </section>
    </main>
  );
}
