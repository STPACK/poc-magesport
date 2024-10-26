import { RetailManagementPageProps, WithRetailManagementPageProps } from './interface'

export function withRetailManagementPage(Component: React.FC<RetailManagementPageProps>) {
function WithRetailManagementPage(props:WithRetailManagementPageProps) {
 const newProps = {
   ...props,
 }
 return <Component {...newProps} />
}
 return WithRetailManagementPage;
}