import { Link } from '@remix-run/react';
import { SignInButton } from '../auth/SignInButton';

function Index() {

  return (
    <>
      <div className="hero min-h-screen">
        <div className="text-center hero-content">
          <div>
            <h1 className="text-3xl font-bold">
              UpSign has been rebuilt
            </h1>
            <p className="mt-4 text-lg">
              It <i>almost</i> looks the same, but let Mr. Hoff know if anything broke.
            </p>
            <div className="mt-4 grid gap-2">
              <SignInButton />
            </div>
            <hr className="my-16" />
            <div>
              Upsign is an app for creating flexible school-day schedules.
              <br />
              Check out our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Index;

