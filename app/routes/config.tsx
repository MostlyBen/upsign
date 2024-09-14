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

const menus: { title: string, id: string }[] = [
  { title: "General", id: "general" },
  { title: "Registrations", id: "registrations" },
  { title: "Schedule", id: "schedule" },
  { title: "People", id: "people" },
  { title: "Groups", id: "groups" },
  { title: "Edit Groups", id: "editgroups" },
  // {title: "New Year", id: "newyear"},
  // {title: "Student List", id: "studentlist"},
]

const Config = () => {
  const [menu, setMenu] = useState<string | undefined>(useLoaderData<typeof loader>().menu);
  const { db, userType } = useOutletContext() as RootContext;
  if (!menu) { return <Navigate to="/config/general" /> }

  return (
    <>
      <NavBar userType={userType} />
      <div className="bg-base-200 p-12 md:py-12 md:px-16 lg:px-24 xl:px-32 2xl:px-64 min-h-screen">
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">

          <div className="bg-base-100 h-full flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible card rounded-lg md:p-4">
            {menus.map(m => <Link
              key={`menu-link-${m.id}`}
              className={`btn btn-ghost w-44 ${menu === m.id ? "font-bold" : "font-normal"}`}
              to={`/config/${m.id}`}
              onClick={() => setMenu(m.id)}
            >
              {m.title}
            </Link>)}
          </div>

          <div className="flex flex-col gap-4 w-full"
            style={{
              height: "calc(100dvh - 10rem)",
              maxHeight: "calc(100dvh - 10rem)",
              maxWidth: "720px",
            }}
          >
            <div role="alert" className="alert alert-warning bg-secondary rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span><b>Warning!</b> These settings affect how UpSign behaves.
                <br />Do not change them unless you know what you&apos;re doing.</span>
            </div>

            <div
              className="p-8 grow bg-base-100 card rounded-lg overflow-y-auto"
            >
              <Outlet
                context={{
                  db,
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
