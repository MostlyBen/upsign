import { User } from "firebase/auth";

const StudentTopMessage = ({ user }: { user: User & { nickname?: string } }) => {
  return (
    <>
      <div className="prose">
        <h1 className="my-2 font-normal select-none">Hey there, {user
          ? user.nickname
            ? <b>{user.nickname.split(' ')[0]}</b>
            : <b>{user.displayName?.split(' ')[0]}</b>
          : ''}
        </h1>
        <blockquote className="top-message py-2 border-primary">
          <p className="m-1">Please sign up for the sessions you want below</p>
          <p className="m-1">Just click on what you want. Your choices are automatically saved 😊</p>
        </blockquote>
      </div>
      <hr style={{ margin: "1rem 0 1rem 0" }} />
    </>
  )
}

export default StudentTopMessage;

