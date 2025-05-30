"use client";

import { BannerPage } from "./BannerPage";
import { withBannerPage } from "./withBannerPage";

const ConnectedBannerPage = withBannerPage(BannerPage);

export { ConnectedBannerPage as BannerPage };
