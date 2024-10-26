"use client";

import { RetailManagementPage } from "./RetailManagementPage";
import { withRetailManagementPage } from "./withRetailManagementPage";

const ConnectedRetailManagementPage =
  withRetailManagementPage(RetailManagementPage);

export { ConnectedRetailManagementPage as RetailManagementPage };
