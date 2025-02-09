import { createPortal } from "react-dom";

const ConfirmModal = ({
  id,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText,
  cancelText,
  withClickOutside,
  withCloseButton,
  open,
}: {
  id: string,
  onConfirm?: () => void,
  onCancel?: () => void,
  title?: string,
  message?: string,
  confirmText?: string,
  cancelText?: string,
  withClickOutside?: boolean,
  withCloseButton?: boolean,
  open?: boolean,
}) => {
  return createPortal(
    <dialog
      id={id}
      className={`modal${typeof open === "boolean" ? " modal-open" : ""}`}
      style={{ zIndex: 99999 }}
      {...(typeof open === "boolean" ? { open: true } : {})}
    >
      <div className="modal-box">
        {withCloseButton &&
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
        }

        {title && <h3 className="font-bold text-lg">{title}</h3>}
        {message && <p className="py-4">{message}</p>}

        <div className="modal-action">
          <form method="dialog">
            <div className="flex justify-end gap-2">
              <button
                className="btn"
                onClick={onCancel}
              >
                {cancelText ?? "No"}
              </button>

              <button
                className="btn btn-primary"
                onClick={onConfirm}
              >
                {confirmText ?? "Yes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {withClickOutside &&
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      }
    </dialog>,
    document.body
  )
}

export default ConfirmModal;

