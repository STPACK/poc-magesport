import { AuthenticationProvider } from "@/providers/AuthenticationProvider";

export default function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <AuthenticationProvider> {children}</AuthenticationProvider>;
}
