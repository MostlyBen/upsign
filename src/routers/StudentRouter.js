import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import { StudentSignUp, NavBar } from '../components';

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

const StudentRouter = ({ db, user, schoolName }) => {

  const router = createBrowserRouter([
    {
      element: <Layout user={user} schoolName={schoolName} />,
      children: [
        {
          path: "/",
          element: <StudentSignUp db={db} user={user} />,
        },
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default StudentRouter