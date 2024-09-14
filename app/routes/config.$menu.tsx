import { Firestore } from "firebase/firestore";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useOutletContext, useLoaderData } from "@remix-run/react";
import { EditGroups, General, Groups, NewYear, People, Registrations, Schedule, StudentList } from "~/components";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return params;
}

const ConfigMenu = () => {
  const menu = useLoaderData<typeof loader>().menu;
  const { db } = useOutletContext() as { db: Firestore, menu: string };

  switch (menu) {
    case "editgroups":
      return <EditGroups db={db} />
    case "groups":
      return <Groups db={db} />
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
    default:
      return <General db={db} />
  }
}

export default ConfigMenu;

