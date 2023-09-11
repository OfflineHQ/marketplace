import { getCurrentUser } from '@next/next-auth/user';
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <section className="container mx-auto">
      {user ? (
        !user.organizerId ? (
          <p>User {user.id} is not an organizer</p>
        ) : (
          children
        )
      ) : (
        <div>Not connected</div>
      )}
    </section>
  );
}
