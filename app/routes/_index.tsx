import { useState, useEffect } from 'react';
import { Outlet, useOutletContext } from '@remix-run/react';
import { getGroupOptions } from '../services';
import { AnonLayout, StudentLayout, TeacherLayout } from "~/layouts";
import { RootContext } from '~/types';

import { TeacherSignUp, StudentSignUp } from '../components';

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

  return (
    <>
      {!user
        ? <AnonLayout>
          <Outlet context={{ db }} />
        </AnonLayout>
        : !userType
          ? <div>Uh oh, Hoff didn&apos;t finish this part</div>
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
