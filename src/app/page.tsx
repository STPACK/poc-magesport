import { ClientLayout } from "@/components/layout/ClientLayout";
import { HomePage } from "@/feature/home/pages/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mega Group",
  description: "Mega Group- Brand Authorized Distributor - สินค้าลิขสิทธิ์แท้ จากตัวแทนจำหน่ายอย่างเป็นทางกา",
};

export default function Home() {
  return (
    <ClientLayout>
      <HomePage />
    </ClientLayout>
  );
}
