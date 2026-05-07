import RegisterForm from "../ui/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="shell">
      <section className="card">
        <header className="card__header">
          <div className="brand">
            <div className="brand__mark" aria-hidden="true">
              BT
            </div>
            <div>
              <h1 className="brand__title">Create account</h1>
            </div>
          </div>
        </header>
        <RegisterForm />
      </section>
    </main>
  );
}