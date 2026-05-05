import LoginForm from "./ui/LoginForm";

export default function Page() {
  return (
    <main className="shell">
      <section className="card">
        <header className="card__header">
          <div className="brand">
            <div className="brand__mark" aria-hidden="true">
              BT
            </div>
            <div>
              <h1 className="brand__title">Log in</h1>
              <p className="brand__subtitle">Use your email and password</p>
            </div>
          </div>
        </header>
        <LoginForm />
      </section>
    </main>
  );
}

