import { useState, useEffect } from 'react';
import { Outlet, Scripts, Links, Meta } from '@remix-run/react';
import { User } from 'firebase/auth';
import { auth, firestore } from '~/lib/firebase';
import { getUserType } from './services';

import './index.css';

export default function App() {
  const db = firestore;
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const type = await getUserType(firestore, user);
        setUserType(type);
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <html lang="en">
      <head>
        <title>UpSign</title>
        <meta name="description" content="Sign up here" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon-16x16.png" />
        <link rel="manifest" href="/public/site.webmanifest" />
        <link rel="mask-icon" href="/public/safari-pinned-tab.svg" color="#5bbad5" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{ db, user, userType }} />
        <Scripts />
      </body>
    </html>
  );
}
