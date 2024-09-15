import { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  query,
  Firestore,
  QueryFieldFilterConstraint
} from "firebase/firestore";

const useFirebaseQuery = <T extends any>(
  db: Firestore,
  collectionPath: string,
  ...queries: QueryFieldFilterConstraint[]
): [
    storedValue: { [key: string]: T },
    setDb: (arg0: Firestore) => void,
    setCollectionString: (arg0: string) => void
  ] => {

  const [_db, setDb] = useState<Firestore>(db);
  const [stored, setStored] = useState<{ [key: string]: T }>({});
  const [collectionString, setCollectionString] = useState<string>(collectionPath);

  useEffect(() => {
    const q = query(collection(_db, collectionPath), ...queries);
    const unsubscribe = onSnapshot(q, (snap) => {
      setStored((_stored) => {
        snap.forEach((doc) => {
          _stored[doc.id] = {
            id: doc.id, ...doc.data()
          } as T;
        });
        return { ..._stored };
      });
    }, (error) => {
      console.error(error);
      window.alert("There was an error syncing from the database. Refresh to sync again.");
    })

    return () => unsubscribe();
  }, [collectionString]);

  return [stored, setDb, setCollectionString];
}

export default useFirebaseQuery;

