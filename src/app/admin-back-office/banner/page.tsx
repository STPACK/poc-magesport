import { AdminLayout } from "@/components/layout/AdminLayout";

import { BannerPage } from "@/feature/bannerManagement/pages/BannerPage";

export default function Banner() {
  return (
    <AdminLayout title="Banner Management">
      <BannerPage />
    </AdminLayout>
  );
}
