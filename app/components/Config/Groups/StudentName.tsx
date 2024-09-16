import { Firestore } from "firebase/firestore";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "~/icons";
import { UpsignUser } from "~/types";
import { getUser, updateUser } from "~/services";

const StudentName = ({
  db,
  student,
  selectedGroup,
  inGroup,
}: {
  db: Firestore,
  student: UpsignUser,
  selectedGroup: string,
  inGroup?: boolean,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClickStudent = async (student: UpsignUser) => {
    if (!student.uid) { return }
    setLoading(true);

    getUser(db, student.uid)
      .then(studentDoc => {
        if (!studentDoc) { return }

        if (Array.isArray(studentDoc.groups)) {
          if (studentDoc.groups.includes(selectedGroup)) {
            const g = studentDoc.groups.filter(obj => {
              return obj !== selectedGroup
            })
            studentDoc.groups = g
          } else {
            studentDoc.groups.push(selectedGroup)
          }
          // Student had no groups
        } else {
          studentDoc.groups = [selectedGroup]
        }

        return studentDoc
      }).then(studentDoc => {
        if (!student || !studentDoc) { return }
        updateUser(db, student.uid as string, { groups: studentDoc.groups })
      }).catch(() => setLoading(false));
  }

  return (
    <button
      className={`btn mb-2 w-full flex flex-row justify-between hover-show-child ${Array.isArray(student.groups)
        ? student.groups.includes(selectedGroup) ? "btn-primary" : ""
        : ""
        } ${loading
          ? "opacity-50 pointer-events-none border-none outline-none"
          : ""}`}
      key={`student-${student.uid}`}
      onClick={() => handleClickStudent(student)}
      disabled={loading}
    >
      {inGroup && <span className="hover-parent-show hidden mb:block"><ChevronLeft /></span>}
      <span>{student.nickname ?? student.name}</span>
      {!inGroup && <span className="hover-parent-show hidden md:block"><ChevronRight /></span>}
    </button>
  )
}

export default StudentName;

