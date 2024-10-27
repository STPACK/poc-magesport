"use client"

import { TaxInvoicePage } from "./TaxInvoicePage";
import { withTaxInvoicePage } from "./withTaxInvoicePage";

const ConnectedTaxInvoicePage = withTaxInvoicePage(TaxInvoicePage);

export { ConnectedTaxInvoicePage as TaxInvoicePage };
