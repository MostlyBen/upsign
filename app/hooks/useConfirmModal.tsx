import { useState, useCallback, ReactElement } from 'react';
import { ConfirmModal } from '~/components';

type ConfirmState = {
  isOpen: boolean;
  message: string;
  resolve: ((value: any) => void) | null;
};

const useConfirm = ({ id }: { id: string }):
  [
    (message: string) => Promise<boolean>,
    ReactElement | null,
    setConfirmMessage: (message: string) => void
  ] => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    resolve: null,
  });

  const setConfirmMessage = (message: string) => {
    setConfirmState(s => ({ ...s, message }));
  };

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ isOpen: true, message, resolve });
    });
  }, []);

  const handleConfirm = () => {
    if (confirmState.resolve) {
      confirmState.resolve(true);
    }
    setConfirmState({ isOpen: false, message: '', resolve: null });
  };

  const handleCancel = () => {
    if (confirmState.resolve) {
      confirmState.resolve(false);
    }
    setConfirmState({ isOpen: false, message: '', resolve: null });
  };

  // Render the modal if it should be open.
  const modal = confirmState.isOpen ? (
    <ConfirmModal
      id={id}
      title="Are you sure?"
      message={confirmState.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      open
    />
  ) : null;

  return [confirm, modal, setConfirmMessage];
};

export default useConfirm;

