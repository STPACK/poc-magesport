import { HomePageProps, WithHomePageProps } from './interface'

export function withHomePage(Component: React.FC<HomePageProps>) {
function WithHomePage(props:WithHomePageProps) {
 const newProps = {
   ...props,
 }
 return <Component {...newProps} />
}
 return WithHomePage;
}