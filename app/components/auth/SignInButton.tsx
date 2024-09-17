import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "../../../app/lib/firebase";

export const SignInButton = () => {
  const provider = new GoogleAuthProvider();
  const auth = useAuth();

  const handleClick = () => {
    console.log(auth);
    if (!auth) {
      return;
    }
    auth.languageCode = "en-US";

    try {
      signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Error:");
      console.error(err?.code, err?.message, err?.email);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="btn btn-primary normal-case min-w-60"
    >
      Sign In With Google
    </button>
  );
};
