import { AdminLayout } from "@/components/layout/AdminLayout";
import { RetailManagementPage } from "@/feature/retailManagement/pages/RetailManagementPage";

export default function RetailStore() {
  return (
    <AdminLayout>
      <RetailManagementPage />
    </AdminLayout>
  );
}
