import { AuthenticationProvider } from "@/providers/AuthenticationProvider";

export default function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <AuthenticationProvider>{children}</AuthenticationProvider>
    </section>
  );
}
