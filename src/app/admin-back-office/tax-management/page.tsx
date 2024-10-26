import { AdminLayout } from "@/components/layout/AdminLayout";
import { TaxManagementPage } from "@/feature/taxManagement/pages/TaxManagementPage";

export default function TaxManagement() {
  return (
    <AdminLayout title='Tax Invoice Management'>
      <TaxManagementPage />
    </AdminLayout>
  );
}
