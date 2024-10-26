import { LoginPageProps, WithLoginPageProps } from './interface'

export function withLoginPage(Component: React.FC<LoginPageProps>) {
function WithLoginPage(props:WithLoginPageProps) {
 const newProps = {
   ...props,
 }
 return <Component {...newProps} />
}
 return WithLoginPage;
}