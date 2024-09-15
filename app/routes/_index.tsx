import { useState, useEffect } from 'react';
import { Outlet, useOutletContext } from '@remix-run/react';
import { getGroupOptions } from '../services';
import { AnonLayout, StudentLayout, TeacherLayout } from "~/layouts";
import { RootContext } from '~/types';

import { TeacherSignUp, StudentSignUp, NewUser } from '../components';

export default function Index() {
  const { db, user, userType } = useOutletContext() as RootContext;
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupOptions = async () => {
      const options = await getGroupOptions(db);
      setGroupOptions(options);
      setLoading(false);
    };

    fetchGroupOptions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log("User type:", userType)

  return (
    <>
      {!user
        ? <AnonLayout>
          <Outlet context={{ db }} />
        </AnonLayout>
        : userType === "new"
          ? <NewUser db={db} user={user} />
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
