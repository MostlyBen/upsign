import { Firestore } from "firebase/firestore";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useOutletContext, useLoaderData } from "@remix-run/react";
import {
  EditGroups,
  EditMyGroups,
  General,
  Groups,
  NewYear,
  People,
  Preferences,
  Registrations,
  Schedule,
  StudentList,
} from "~/components";
import { User } from "firebase/auth";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return params;
}

const ConfigMenu = () => {
  const menu = useLoaderData<typeof loader>().menu;
  const { db, user } = useOutletContext() as { db: Firestore, user: User };

  switch (menu) {
    case "editgroups":
      return <EditGroups db={db} />
    case "groups":
      return <Groups db={db} userId={user.uid} />
    case "newyear":
      return <NewYear db={db} />
    case "people":
      return <People db={db} />
    case "registrations":
      return <Registrations db={db} />
    case "schedule":
      return <Schedule db={db} />
    case "studentlist":
      return <StudentList db={db} />
    case "preferences":
      return <Preferences db={db} />
    case "my_groups":
      return <EditMyGroups db={db} userId={user.uid as string} />
    default:
      return <General db={db} />
  }
}

export default ConfigMenu;

