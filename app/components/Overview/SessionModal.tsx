import { Firestore } from "firebase/firestore";
import { useEffect } from "react";
import { SessionEditor } from "~/components";
import { Enrollment, Session } from "~/types";

type SessionModalProps = {
  db: Firestore,
  session: Session,
  date: Date,
  enrollments: Enrollment[],
  groupOptions: string[],
  onClose: () => void,
}

const SessionModal = ({
  db,
  session,
  date,
  enrollments,
  groupOptions,
  onClose,
}: SessionModalProps) => {

  useEffect(() => {
    if (!window) { return }

    const handleKeypress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }

    const handleClick = (e: any) => {
      if ([`modal-${session.id}`, "modal-container"].includes(e.target.id)) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeypress);
    window.addEventListener('pointerdown', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeypress);
      window.removeEventListener('pointerdown', handleClick);
    }
  }, []);

  return (
    <div
      id={`modal-${session.id}`}
      className="fixed z-50 top-0 bottom-0 left-0 right-0 flex align-middle justify-center modal-open modal-bg"
    >
      <div
        className="h-fit w-fit m-auto px-6 md:py-12 md:px-32"
        id="modal-container"
      >
        <div
          className="overflow-y-auto h-full"
          style={{ maxHeight: "80dvh" }}
        >
          <SessionEditor
            db={db}
            session={session}
            date={date}
            enrollmentsFromParent={enrollments}
            groupOptions={groupOptions}
            isModal
          />
        </div>
      </div>
    </div>
  )
}

export default SessionModal;

