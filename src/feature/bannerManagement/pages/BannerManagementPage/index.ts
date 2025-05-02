"use client";

import { BannerManagementPage } from "./BannerManagementPage";
import { withBannerManagementPage } from "./withBannerManagementPage";

const ConnectedBannerManagementPage =
  withBannerManagementPage(BannerManagementPage);

export { ConnectedBannerManagementPage as BannerManagementPage };
