import { UploadModalProps, WithUploadModalProps } from './interface'

export function withUploadModal(Component: React.FC<UploadModalProps>) {
function WithUploadModal(props:WithUploadModalProps) {
 const newProps = {
   ...props,
 }
 return <Component {...newProps} />
}
 return WithUploadModal;
}