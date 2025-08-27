import { Firestore } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  getAllStudents,
  // updateUser,
  // deleteUser,
} from "~/services";
// import { getSchoolId } from "~/utils";
import { UpsignUser } from "~/types";

type NewYearProps = {
  db: Firestore,
}

// const getNewGroups = (groups: string[]) => {
//   if (groups.includes('9th Grade')) {
//     return ['10th Grade']
//   } else if (groups.includes('10th Grade')) {
//     return ['11th Grade']
//   } else if (groups.includes('11th Grade')) {
//     return ['12th Grade']
//   } else {
//     console.warn(`Invalid groups: ${groups}`)
//     return []
//   }
// }

const NewYear = ({ db }: NewYearProps) => {
  const [allStudents, setAllStudents] = useState<UpsignUser[]>([])

  useEffect(() => {
    getAllStudents(db).then(res => setAllStudents(res as UpsignUser[]))
  }, [db]);

  const updateGroups = async () => {
    // if (window.confirm('Are you sure? This will remove all student groups and change their grades.')) {
    //   console.log('updating groups')
    //   const schoolId = getSchoolId()
    //
    //   for (const student of allStudents) {
    //     if (!student.groups || !student.uid) { continue }
    //     if (student.groups.includes('12th Grade')) {
    //       console.log('deleting', student.name)
    //       await deleteUser(db, student.uid)
    //     } else {
    //       const newGroups = getNewGroups(student.groups)
    //       console.log(student.name, student.groups, '->', newGroups)
    //       await updateUser(db, student.uid, { groups: newGroups }, schoolId)
    //     }
    //   }
    // }
  }

  return (
    <>
      <h4 className="mb-4">
        New Year
      </h4>
      <div>
        Ben, you&apos;re gonna hate yourself if you click this button twice.
      </div>

      <button
        className="btn btn-primary"
        onClick={() => {
          if (window.confirm('Are you sure you want to do this?')) {
            updateGroups()
          }
        }}
      >
        Delete all 12th graders.
        <br />
        Update all users to have a grade 1 higher than they do.
        Remove all other groups from them.
      </button>

      <hr className="my-4" />
      {Array.isArray(allStudents) && allStudents.map((student, index) => {
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <p>{student.name}</p>
            <p>{JSON.stringify(student.groups)}</p>
          </div>
        )
      })}
    </>
  )
}

export default NewYear;

