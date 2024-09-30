import { useState } from "react";
import { Link, Navigate, Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { RootContext } from "~/types";
import { NavBar } from "~/components";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return params;
}

const schoolMenus: { title: string, id: string }[] = [
  { title: "General", id: "general" },
  { title: "Registrations", id: "registrations" },
  { title: "Schedule", id: "schedule" },
  { title: "People", id: "people" },
  { title: "Groups", id: "groups" },
  { title: "Edit Groups", id: "editgroups" },
  // {title: "New Year", id: "newyear"},
  // {title: "Student List", id: "studentlist"},
]

const personalMenus: { title: string, id: string }[] = [
  { title: "Preferences", id: "preferences" },
  { title: "My Groups", id: "my_groups" },
]

const Config = () => {
  const [menu, setMenu] = useState<string | undefined>(useLoaderData<typeof loader>().menu);
  const { db, user, userType } = useOutletContext() as RootContext;
  if (!menu) { return <Navigate to="/config/general" /> }

  if (!userType || ["new", "student"].includes(userType)) {
    return <Navigate to="/" />
  }

  return (
    <>
      <NavBar userType={userType} />
      <div className="bg-base-200 p-12 md:py-12 md:px-16 lg:px-24 xl:px-32 2xl:px-64 min-h-screen">
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">

          <div className="prose">
            <h4>School Settings</h4>
            <div
              className="bg-base-100 h-fit flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible card rounded-lg md:p-2 mb-4"
            >
              {schoolMenus.map(m => <Link
                key={`menu-link-${m.id}`}
                className={`btn btn-ghost rounded-md w-44 ${menu === m.id ? "font-bold" : "font-normal"}`}
                to={`/config/${m.id}`}
                onClick={() => setMenu(m.id)}
              >
                {m.title}
              </Link>)}
            </div>

            <h4>My Settings</h4>
            <div className="bg-base-100 h-fit flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible card rounded-lg md:p-2">
              {personalMenus.map(m => <Link
                key={`menu-link-${m.id}`}
                className={`btn btn-ghost rounded-md w-44 ${menu === m.id ? "font-bold" : "font-normal"}`}
                to={`/config/${m.id}`}
                onClick={() => setMenu(m.id)}
              >
                {m.title}
              </Link>)}
            </div>

          </div>

          <div className="w-full"
            style={{
              height: "calc(100dvh - 10rem)",
              maxHeight: "calc(100dvh - 10rem)",
              maxWidth: "720px",
              marginTop: "32px",
            }}
          >
            <div
              className="p-8 grow bg-base-100 card rounded-lg overflow-y-auto"
              style={{
                height: "calc(100dvh - 16rem)",
                maxHeight: "calc(100dvh - 16rem)",
              }}
            >
              <Outlet
                context={{
                  db,
                  user,
                }}
              />

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Config;
