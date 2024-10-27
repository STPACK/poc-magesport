import { TaxInvoicePageProps, WithTaxInvoicePageProps } from './interface'

export function withTaxInvoicePage(Component: React.FC<TaxInvoicePageProps>) {
function WithTaxInvoicePage(props:WithTaxInvoicePageProps) {
 const newProps = {
   ...props,
 }
 return <Component {...newProps} />
}
 return WithTaxInvoicePage;
}