import { ClientLayout } from "@/components/layout/ClientLayout";
import { TaxInvoicePage } from "@/feature/taxInvoice/pages/TaxInvoicePage";
import { Suspense } from "react";

export default function TaxInvoice() {
  return (
    <ClientLayout>
      <Suspense>
        <TaxInvoicePage />
      </Suspense>
    </ClientLayout>
  );
}
