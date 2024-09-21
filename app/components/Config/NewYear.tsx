import { Firestore } from "firebase/firestore";
import { useState, useEffect } from "react";

type NewYearProps = {
  db: Firestore,
}

const NewYear = ({ db }: NewYearProps) => {
  return (
    <div>
      Uh oh, this menu didn&apos;t make it over from the original UpSign yet.
    </div>
  )
}

export default NewYear;

