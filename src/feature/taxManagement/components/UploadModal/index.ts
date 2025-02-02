import { UploadModal } from "./UploadModal";
import { withUploadModal } from "./withUploadModal";

const ConnectedUploadModal = withUploadModal(UploadModal);

export { ConnectedUploadModal as UploadModal };