import { AdminLayout } from "@/components/layout/AdminLayout";
import { BannerManagementPage } from "@/feature/bannerManagement/pages/BannerManagementPage";

export default function BannerManagement() {
  return (
    <AdminLayout title="Banner View">
      <BannerManagementPage />
    </AdminLayout>
  );
}
