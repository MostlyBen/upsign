import { useState, useEffect } from 'react';
import { Outlet, useOutletContext } from '@remix-run/react';
import { getGroupOptions } from '../services';
import { AnonLayout, StudentLayout, TeacherLayout } from "~/layouts";
import { RootContext } from '~/types';

import { TeacherSignUp, StudentSignUp, NewUser } from '../components';

export default function Index() {
  const { db, authUser, user, userType } = useOutletContext() as RootContext;
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupOptions = async () => {
      const options = await getGroupOptions(db, user?.uid);
      setGroupOptions(options);
      setLoading(false);
    };

    fetchGroupOptions();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!authUser
        ? <AnonLayout>
          <Outlet context={{ db }} />
        </AnonLayout>
        : userType === "new"
          ? <NewUser db={db} user={authUser} />
          : userType === 'teacher'
            ? <TeacherLayout>
              <TeacherSignUp db={db} user={user} groupOptions={groupOptions} />
              <Outlet context={{ db, user, userType }} />
            </TeacherLayout>
            : <StudentLayout>
              <StudentSignUp db={db} user={user} />
            </StudentLayout>

      }
    </>
  );
}
