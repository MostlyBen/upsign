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
    setCollectionString: (arg0: string) => void,
    setQueries: (arg0: QueryFieldFilterConstraint[]) => void,
    setDb: (arg0: Firestore) => void,
  ] => {
  const [_db, setDb] = useState<Firestore>(db);
  const [_queries, setQueries] = useState<QueryFieldFilterConstraint[]>(queries);
  const [stored, setStored] = useState<{ [key: string]: T }>({});
  const [collectionString, setCollectionString] = useState<string>(collectionPath);

  useEffect(() => {
    setStored({});
    const q = query(collection(_db, collectionString), ..._queries);
    const unsubscribe = onSnapshot(q, (snap) => {
      setStored((_stored) => {
        // Changes & creations
        snap.forEach((doc) => {
          _stored[doc.id] = {
            id: doc.id, ...doc.data()
          } as T;
        });
        // Deletions
        for (const change of snap.docChanges()) {
          if (change.type === "removed") {
            delete _stored[change.doc.id];
          }
        }
        return { ..._stored };
      });
    }, (error) => {
      console.error(error);
      window.alert("There was an error syncing from the database. Refresh to sync again.");
    })

    return () => unsubscribe();
  }, [collectionString, _queries]);

  return [stored, setCollectionString, setQueries, setDb];
}

export default useFirebaseQuery;

