import { db } from "@/db";
import { users } from "@/db/schema";

export default async function UsersPage() {
  const result = await db.select().from(users);

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Users</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: "8px" }}>ID</th>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {result.map((user: typeof users.$inferSelect) => (
            <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{user.id}</td>
              <td style={{ padding: "8px" }}>{user.name}</td>
              <td style={{ padding: "8px" }}>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
