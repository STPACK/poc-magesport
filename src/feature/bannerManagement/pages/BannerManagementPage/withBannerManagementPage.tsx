import { BannerManagementPageProps } from "./interface";

export function withBannerManagementPage(
  Component: React.FC<BannerManagementPageProps>
) {
  function WithBannerManagementPage() {
    const newProps = {};
    return <Component {...newProps} />;
  }
  return WithBannerManagementPage;
}
