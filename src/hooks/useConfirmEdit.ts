import React from 'react';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';

const useConfirmEdit = (checkChange: () => boolean) => {
  const { showSubModal, hideSubModal } = useGlobalModalContext();

  React.useEffect(() => {
    window.confirmEdit = (cb: () => void) => {
      const hasChanged = checkChange();
      if (hasChanged) {
        showSubModal({
          title: 'lang_confirm_cancel',
          component: ConfirmEditModal,
          props: {
            title: 'lang_confirm_cancel_text',
            cancelText: 'lang_no',
            confirmText: 'lang_yes',
            emailConfirm: false,
            onSubmit: () => {
              hideSubModal();
              cb?.();
            },
          },
        });
      } else {
        cb?.();
      }
    };
    return () => {
      window.confirmEdit = null;
    };
  }, []);

  return true;
};

export default useConfirmEdit;
