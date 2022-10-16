import { useAppSelector } from '@/app/store';
import { MODAL_COMPONENT_MAP } from '@/slices/modalSlice';

function Modal() {
  const modalType = useAppSelector(store => store.modal.type);
  if (!modalType) return <></>;

  const ModalComponent = MODAL_COMPONENT_MAP[modalType!];
  return <ModalComponent />;
}

export default Modal;
