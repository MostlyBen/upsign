import { UpsignUser } from "~/types"

type NameProps = {
  user: UpsignUser,
  selectUser: (arg0: string, arg1: boolean) => void,
}
const NameListName = ({ user, selectUser }: NameProps) => {
  const closeModal = (uid: string) => {
    selectUser(uid, true);
  }

  return (
    <button className="leading-6 btn btn-ghost block w-full text-left" onClick={() => closeModal(user.uid as string)}>
      {/* Name */}
      <span>{user.nickname ?? user.name}</span>
      {/* Email */}
      <span className="opacity-60 ml-2 font-light">{user.email}</span>
      {/* User Type */}
      <span style={{ color: "grey", float: "right" }}>
        {user.type && user.type.charAt(0).toUpperCase() + user.type.slice(1)}
      </span>
    </button>
  )
}

export default NameListName;

