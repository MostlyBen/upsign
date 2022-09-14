import { useEffect, useState } from "react"

import M from "materialize-css"

import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../../../services"
import { MenuDiv } from "../../";

const NamesListName = ({ user, selectUser }) => {
  const closeModal = (uid) => {
    selectUser(uid, true)
    var elem = document.getElementById(`names-modal`)
    var instance = M.Modal.getInstance(elem)
    instance.close()
  }

  return (
    <div className="user-name-list-name waves-effect" onClick={() => closeModal(user.uid)}>
      {/* Name */}
      {user.nickname ?? user.name}
      {/* User Type */}
      <span style={{color: "grey", float: "right"}}>
        {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
      </span>
    </div>
  )
}

const People = ({ db }) => {
  const [userList, setUserList] = useState([])
  const [userNameObject, setUserNameObject] = useState([])
  const [userIdFinder, setUserIdFinder] = useState()
  const [selectedUser, setSelectedUser] = useState()

  const updateUserList = async (db) => {
    var allUsers = await getAllUsers(db)
    allUsers.sort((a, b) => (( a.nickname ?? a.name ) > ( b.nickname ?? b.name )) ? 1 : -1 )
    setUserList(allUsers)
  }

  const updateSelectedUser = (str, asUid=false) => {
    var userObject
    var uid = asUid ? str : userIdFinder[str]

    const filteredArr = userList.filter(user => user.uid === uid)
    userObject = filteredArr[0]

    setSelectedUser(userObject)
  }

  // Initialize the Modal
  useEffect(() => {
    var modal = document.getElementById(`names-modal`)
    // eslint-disable-next-line no-unused-vars
    var modalInstances = M.Modal.init(modal, {})

    var elems = document.querySelectorAll('select');
    // eslint-disable-next-line no-unused-vars
    var selectorInstances = M.FormSelect.init(elems, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updateUserList(db)

  }, [db])

  const getNameForList = (nameObject, name) => {
    let namesArr = Object.keys(nameObject)
    if (!namesArr.includes( name )) {
      return name
    } else {
      let i = 1
      for (var j in namesArr) {
        if (namesArr[j].includes(name)) {
          i++
        }
      }

      return `${name} (${i})`
    }
  }

  useEffect(() => {
    let newObject = {}
    let newUserIdFinder = {}

    for (var i in userList) {
      let user = userList[i]
      let name = user.nickname ?? user.name
      name = getNameForList(newObject, name)
      newUserIdFinder[name] = user.uid
      newObject[name] = null
    }

    setUserNameObject(newObject)
    setUserIdFinder(newUserIdFinder)
  }, [userList])

  useEffect(() => {
    var elems = document.getElementById('user-name-box')
    M.Autocomplete.init(elems, {data: userNameObject, onAutocomplete: updateSelectedUser} )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userNameObject])

  const updateDropdown = (userType) => {
    var elem = document.getElementById("user-type-select")
    if (elem !== null) {
        for (var option of elem.options) {
          if (option.value === userType) {
            option.selected = true
            return
          }
        }
    } else {
      setTimeout(updateDropdown, 15)
    }
  }

  useEffect(() => {
    var nameInputElem = document.getElementById('user-name-box')
    var nameElem = document.getElementById('user-name')
    var emailElem = document.getElementById('user-email')
    var nicknameElem = document.getElementById('user-nickname')

    if (selectedUser) {
      nameInputElem.value = selectedUser.nickname ?? selectedUser.name
      nameElem.value = selectedUser.name
      emailElem.value = selectedUser.email
      nicknameElem.value = selectedUser.nickname ?? ''
      updateDropdown(selectedUser.type)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser])

  const handleChangeNickname = async (e) => {
    if (typeof e.target.value === 'string' && e.target.value.length > 0) {
      await updateUser(db, selectedUser.uid, {nickname: e.target.value})
    } else {
      await updateUser(db, selectedUser.uid, 'nickname', null, true)
    }
  }

  const handleChangeUserType = async (e) => {
    console.log(e)
    var elem = document.getElementById("user-type-select")
    var value = elem.value

    await updateUser(db, selectedUser.uid, {type: value})
  }

  const handleDeleteUser = () => {
    if (window.confirm(`Are you sure you want to remove ${selectedUser.nickname ?? selectedUser.name} from this school?`)) {
      deleteUser(db, selectedUser.uid)
      setSelectedUser({})
      
      var nameInputElem = document.getElementById('user-name-box')
      var nameElem = document.getElementById('user-name')
      var emailElem = document.getElementById('user-email')
      var nicknameElem = document.getElementById('user-nickname')

      nameInputElem.value = ''
      nameElem.value = ''
      emailElem.value = ''
      nicknameElem.value = ''
      updateDropdown('')
    }
  }

  return (
    <div className="menu-card">
      <h1>
        Manage People
      </h1>

      {/* Names List Modal */}
      <div id={`names-modal`} className="modal card names-list" style={{overflowY: "hidden", paddingBottom: "0 !important"}}>
        <div className="modal-content row" style={{paddingBottom: "0"}}>
          <div style={{height: "6vh", borderBottom: "2px solid grey"}}>
            <h4 style={{position: "fixed"}}>All Users</h4>
          </div>
            <div className="col s12">
              <div className="" style={{height: "60vh", overflowY: "scroll", borderBottom: "2px solid grey"}}>
                <div className="user-names-list-container">
                  {userList.map(user => 
                    (<NamesListName user={user} selectUser={updateSelectedUser} key={`user-name-${user.uid}`} />)
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>

      <div className="row">
        {/* User Search Menu */}
        <div className="col s12">
          <MenuDiv />
          <h2>Select Person</h2>
          <div className="row" style={{marginBottom: "0"}}>
            <div className="input-field col s12">
              <i className="material-icons prefix">person</i>
              <input type="text" id="user-name-box" className="autocomplete" autoComplete="off" />
              <label htmlFor="user-name-box">Find User</label>
            </div>
          </div>

          <a className="btn waves-effect waves-light modal-trigger" data-target="names-modal" href="#!">
            List All Users
          </a>

          <MenuDiv className="col s12" />
        </div>

        {/* Student Info Section */}
        <div className="col s12">
          <h2>Edit Person</h2>

          {/* Name */}
          <div className="input-field col s12 m6 disabled-input-holder">
            <div className="disabled-input-title">Name</div>
            <input placeholder="User Name" id="user-name" type="text" className="disabled disabled-text-input" />
          </div>

          {/* Email */}
          <div className="input-field col s12 m6 disabled-input-holder">
            <div className="disabled-input-title">Email</div>
            <input placeholder="Email" id="user-email" type="text" className="disabled disabled-text-input" />
          </div>

          {/* Nickname */}
          <div className="input-field col s12 m6">
            <div>Nickname</div>
            <input placeholder="No Nickname" id="user-nickname" type="text" className="" autoComplete="off" onChange={handleChangeNickname} />
          </div>

          {/* Type */}
          <div className="input-field col s12 m6">
            <div>Role</div>
            <select className="browser-default" id="user-type-select" onChange={handleChangeUserType}>
              <option value="" disabled selected>User Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

        </div>
        {/* Delete User */}
        <div className="col s12 m6" style={{marginLeft: "0.5rem", marginTop: "0.5rem"}}>
          <div className="btn waves-effect white grey-text text-darken-2" style={{height: "3rem"}} onClick={handleDeleteUser}>
          <i className="material-icons red-text text-lighten-1" style={{position: "relative", top: "0.325rem", left: "-0.25rem"}}>delete</i>
            Delete User
          </div>
        </div>

      </div>
    </div>
  )
}

export default People