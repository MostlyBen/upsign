import { User } from "firebase/auth";

const TopMessage = ({ user }: { user: User & { nickname?: string } }) => {
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
          <p className="m-1">Fill in whatever sessions you want to hold.</p>
          <p className="m-1">Sessions without titles will not show up as options for students.</p>
        </blockquote>
      </div>
      <hr style={{ margin: "1rem 0 1rem 0" }} />
    </>
  )
}

export default TopMessage;

