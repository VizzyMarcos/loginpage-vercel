import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "../../utils/auth";
import { deleteUser, listRegisteredUsers } from "../../utils/users";

export const dynamic = "force-dynamic";

export default async function DashboardPage(props: { searchParams?: { q?: string } }) {
  const session = getSession(cookies());
  if (!session) redirect("/");
  if (session.role !== "admin") redirect("/welcome");

  const q = (props.searchParams?.q ?? "").toString();
  const users = await listRegisteredUsers(q);

  async function remove(formData: FormData) {
    "use server";
    const session = getSession(cookies());
    if (!session || session.role !== "admin") redirect("/");
    const userId = String(formData.get("user_id") ?? "");
    if (!userId) return;
    await deleteUser(userId);
  }

  return (
    <main className="shell">
      <section className="card card--wide">
        <header className="card__header">
          <div className="brand">
            <div className="brand__mark" aria-hidden="true">
              BT
            </div>
            <div>
              <h1 className="brand__title">Admin dashboard</h1>
              <p className="brand__subtitle">Signed in as {session.email}</p>
            </div>
          </div>
        </header>

        <div className="row row--space" style={{ alignItems: "flex-end" }}>
          <div>
            <div style={{ fontWeight: 700 }}>Registered users</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {users.length} total
            </div>
          </div>
          <form action="/dashboard" method="get">
            <input className="field__input" name="q" type="search" defaultValue={q} placeholder="Search name or email…" />
          </form>
        </div>

        <div style={{ height: 12 }} />

        <div className="tableWrap" role="region" aria-label="Users table">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Created</th>
                <th scope="col" className="right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td className="mono">{u.email}</td>
                    <td>{u.created_at}</td>
                    <td className="right">
                      <form action={remove}>
                        <input type="hidden" name="user_id" value={u.id} />
                        <button className="btn" type="submit">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
