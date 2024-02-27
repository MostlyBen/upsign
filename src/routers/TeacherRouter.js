import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import { TeacherSignUp, AllSessionOverview, Config, NavBar } from '../components';

import { getDefaultDay, getGroupOptions } from "../services";

const Layout = ({user, schoolName}) => {
  return (
    <div>
      <NavBar user={user} userType="teacher" schoolName={schoolName} />
      {/* body-container is styled to be below the navbar & have light/dark theme */}
      <div className="body-container">
        {/* container is here because materialize has its width settings */}
        <div className="container">
          <Outlet />
        </div>
      </div>
    </div>)
}

const DefaultLoader = async (db) => {
  const defaultDay = await getDefaultDay(db)
  const groupOptions = await getGroupOptions(db)
  return {
    defaultDay: defaultDay,
    groupOptions: groupOptions,
  }
}

const TeacherRouter = ({ db, user, schoolName }) => {
  const router = createBrowserRouter([
    {
      element: <Layout user={user} schoolName={schoolName} />,
      children: [
        {
          path: "/overview/:session",
          element: <AllSessionOverview db={db} />,
          loader: async () => DefaultLoader(db),
        },
        {
          path: "/overview",
          element: <Navigate to="/overview/1" />,
        },
        {
          path: "/config/:menu",
          element: <Config db={db} />,
        },
        {
          path: "/config",
          element: <Config db={db} />,
        },
        {
          path: "/",
          element: <TeacherSignUp db={db} user={user} />,
          loader: async () => DefaultLoader(db),
        }
      ]
    }
  ])

  return <RouterProvider router={router} />

}

export default TeacherRouter
