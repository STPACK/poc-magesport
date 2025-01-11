"use client";

import { withAuthenGuard } from "@/hocs/withAuthenGuard";
import { RetailManagementPage } from "./RetailManagementPage";
import { withRetailManagementPage } from "./withRetailManagementPage";

const ConnectedRetailManagementPage = withAuthenGuard(
  withRetailManagementPage(RetailManagementPage)
);

export { ConnectedRetailManagementPage as RetailManagementPage };
