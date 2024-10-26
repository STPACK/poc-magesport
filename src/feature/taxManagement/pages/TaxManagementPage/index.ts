"use client";

import { withAuthenGuard } from "@/hocs/withAuthenGuard";
import { TaxManagementPage } from "./TaxManagementPage";
import { withTaxManagementPage } from "./withTaxManagementPage";

const ConnectedTaxManagementPage = withAuthenGuard(
  withTaxManagementPage(TaxManagementPage)
);

export { ConnectedTaxManagementPage as TaxManagementPage };
