import { EditModal } from "./EditModal";
import { withEditModal } from "./withEditModal";

const ConnectedEditModal = withEditModal(EditModal);

export { ConnectedEditModal as EditModal };
