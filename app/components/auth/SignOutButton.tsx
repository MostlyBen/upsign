import { auth } from "../../../app/lib/firebase";

export const SignOutButton = () => {
  const handleClick = () => {
    auth.signOut().then(() => {
      window.location.assign('/');
    });
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="btn normal-case"
    >
      Sign Out
    </button>
  );
};
