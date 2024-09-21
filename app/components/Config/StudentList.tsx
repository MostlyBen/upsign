import { Firestore } from "firebase/firestore";
import { useState, useEffect } from "react";

type StudentListProps = {
  db: Firestore,
}

const StudentList = ({ db }: StudentListProps) => {
  return (
    <div>
      Uh oh, this menu didn&apos;t make it over from the original UpSign yet.
    </div>
  )
}

export default StudentList;

