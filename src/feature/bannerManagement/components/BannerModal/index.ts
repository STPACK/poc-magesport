import { BannerModal } from "./BannerModal";
import { withBannerModal } from "./withBannerModal";

const ConnectedBannerModal = withBannerModal(BannerModal);

export { ConnectedBannerModal as BannerModal };
