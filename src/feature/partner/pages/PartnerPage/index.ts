"use client";

import { PartnerPage } from "./PartnerPage";
import { withPartnerPage } from "./withPartnerPage";

const ConnectedPartnerPage = withPartnerPage(PartnerPage);

export { ConnectedPartnerPage as PartnerPage };
