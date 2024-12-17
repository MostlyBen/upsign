import { Firestore, getDocs, where, collection, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Enrollment } from '~/types';
import { getSchoolId } from "~/utils";


type GoneMissingProps = {
  db: Firestore,
  date: Date,
  hour: number,
  enrollments: Enrollment[],
}

type GoneMissingModalProps = {
  db: Firestore,
  date: Date,
  hour: number,
  absentThisHour: Enrollment[],
  onClose: () => void,
}

const GoneMissingModal = ({ db, date, hour, onClose, absentThisHour }: GoneMissingModalProps) => {
  const [goneMissing, setGoneMissing] = useState<Enrollment[]>()
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const updateGoneMissing = async (ids: string[]) => {
      // don't run if there aren't any ids or a path for the collection
      if (!ids || !ids.length) return [];

      const collectionRef = collection(
        db,
        `schools/${getSchoolId()}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`
      );
      const batches = [];

      while (ids.length) {
        // firestore limits batches to 10
        const batch = ids.splice(0, 10);

        // add the batch request to to a queue
        batches.push(
          getDocs(
            query(
              collectionRef,
              where("session", "==", Number(hour) - 1),
              where("attendance", "in", ["present", "tardy"]),
              where("uid", "in", [...batch])
            )
          ).then(snapshot => {
            const docs = snapshot.docs.map(doc => doc.data());
            return docs;
          })
        )
      }

      // after all of the data is fetched, return it
      return Promise.all(batches)
        .then(content => content.flat());
    }

    updateGoneMissing(absentThisHour.map(e => e.uid as string)).then(res => {
      setLoading(false);
      setGoneMissing(res.sort((a, b) => {
        return (a.nickname ?? a.name) > (b.nickname ?? b.name) ? 1 : -1;
      }) as Enrollment[]);
    })

  }, [absentThisHour]);

  useEffect(() => {
    if (!window) { return }

    const handleKeypress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }

    const handleClick = (e: any) => {
      if (["gone-missing-modal", "modal-container"].includes(e.target.id)) {
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
      id="gone-missing-modal"
      className="fixed z-50 top-0 bottom-0 left-0 right-0 flex align-middle justify-center modal-open modal-bg"
    >
      <div
        className="h-fit w-fit m-auto px-6 md:py-12 md:px-32"
        id="modal-container"
        style={{ maxHeight: "100dvh", overflowY: "auto" }}
      >
        <div className="card prose bg-base-100 shadow-xl p-8"
          style={{ maxHeight: "80dvh", overflowY: "auto" }}
        >
          <h2>Gone Missing</h2>
          {loading && <div>Loading...</div>}
          {goneMissing && goneMissing.length
            ? goneMissing.map(e => <div key={e.uid}>{e.nickname ?? e.name}</div>)
            : <div className="opacity-80">No students</div>
          }
        </div>
      </div>
    </div>
  )
}


const GoneMissing = ({
  db,
  date,
  hour,
  enrollments
}: GoneMissingProps) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(false);
  }, [db, hour]);

  if (hour <= 1) { return <></> }

  return (<>
    <button
      className="btn btn-ghost"
      onClick={() => setOpen(true)}
    >
      Gone Missing
    </button>
    {open &&
      <GoneMissingModal
        db={db}
        date={date}
        hour={hour}
        absentThisHour={enrollments.filter(e => e.attendance === "absent")}
        onClose={() => setOpen(false)}
      />}
  </>)
}

export default GoneMissing;

