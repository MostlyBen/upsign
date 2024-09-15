import { Link } from '@remix-run/react';
import { ReactNode } from 'react';
import { NavBar } from '~/components';
import { Gear } from '~/icons';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar userType="teacher" schoolName="UpSign" />
      <div className="bg-base-200 p-8 md:py-12 md:px-16 lg:px-24 xl:px-32 2xl:px-64 print:p-1">
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
          }}
        >
          <Gear />
        </Link>
      </div>
    </>
  );
}
