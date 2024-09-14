import { ReactNode } from 'react';
import { NavBar } from '~/components';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar userType="student" schoolName="" />
      <div className="bg-base-200 min-h-screen p-12 md:py-12 md:px-16 lg:px-24 xl:px-32 2xl:px-64">
        <div className="mt-16">
          {children}
        </div>
      </div>
    </>
  );
}
