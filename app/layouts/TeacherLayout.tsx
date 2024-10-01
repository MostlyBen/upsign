import { Link } from '@remix-run/react';
import { ReactNode } from 'react';
import { NavBar } from '~/components';
import { Gear } from '~/icons';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar userType="teacher" schoolName="UpSign" />
      <div
        className="bg-base-200 p-8 md:py-12 md:px-16 lg:px-24 mx-auto print:p-1"
        style={{ maxWidth: "1800px", minHeight: "100dvh" }}
      >
        <div className="mt-16 print:mt-0">
          {children}
        </div>
        <Link
          to="/config/general"
          className="fixed btn btn-circle btn-lg bg-base-100 shadow-lg print:hidden"
          style={{
            height: "3.5rem",
            width: "3.5rem",
            minHeight: "3.5rem",
            right: "24px",
            bottom: "24px",
            zIndex: 10000,
          }}
        >
          <Gear />
        </Link>
      </div>
    </>
  );
}
