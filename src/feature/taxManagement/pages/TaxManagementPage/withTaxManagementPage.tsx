import { TaxManagementPageProps, WithTaxManagementPageProps } from './interface'

export function withTaxManagementPage(Component: React.FC<TaxManagementPageProps>) {
function WithTaxManagementPage(props:WithTaxManagementPageProps) {
 const newProps = {
   ...props,
 }
 return <Component {...newProps} />
}
 return WithTaxManagementPage;
}