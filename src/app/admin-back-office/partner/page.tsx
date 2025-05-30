import { AdminLayout } from "@/components/layout/AdminLayout";

import { PartnerPage } from "@/feature/partner/pages/PartnerPage";

export default function Banner() {
  return (
    <AdminLayout>
      <PartnerPage />
    </AdminLayout>
  );
}
