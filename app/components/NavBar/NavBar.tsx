import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '~/img/logo192.png';
import { SignOutButton } from '~/components';
import ThemeSelector from "./ThemeSelector";

const Menu = () => {

  return (
    <div
      id="navbar-left-menu"
      className="fixed top-16 p-4 bg-base-100 drop-shadow-lg flex flex-col justify-center"
      style={{ zIndex: 10000 }}
    >
      <ThemeSelector />
      <hr className="mt-2 mb-4" />

      <SignOutButton />
    </div>
  )
}

const TeacherLinks = () => {
  return (
    <div className="flex felx-row gap-4 text-xl">
      <Link
        to="/"
      >Home</Link>
      <Link
        to="/overview/1"
      >All Sessions</Link>
    </div>
  )
}

type NavBarProps = {
  userType: string,
  schoolName?: string,
}

const NavBar = ({ userType, schoolName }: NavBarProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleClickShow = () => {
    setShowMenu(s => !s);
  }

  useEffect(() => {
    const handleClick = (e) => {
      const menuEl = document.getElementById('navbar-left-menu');
      const btnEl = document.getElementById('navbar-left-menu-btn');

      if (!menuEl || !btnEl) {
        setShowMenu(false);
        return;
      }

      if (!menuEl.contains(e.target) && !btnEl.contains(e.target)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      window.addEventListener("click", handleClick);
    }

    return () => window.removeEventListener("click", handleClick);
  }, [showMenu])

  return (
    <>
      <div
        className="print:hidden"
        style={{
          opacity: showMenu ? 1 : 0,
          pointerEvents: showMenu ? "all" : "none",
        }}
      >
        <Menu />
      </div>
      <div
        className="navbar px-4 bg-base-100 fixed drop-shadow-xl print:hidden"
        style={{ zIndex: 10000 }}
      >
        <div role="button" onClick={handleClickShow} id="navbar-left-menu-btn">
          <img
            src={logo}
            alt="logo"
            style={{
              height: "40px"
            }}
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        <div className="flex-1 pl-2">
          {userType === 'teacher'
            ? <TeacherLinks />
            : schoolName}
        </div>
      </div>
    </>
  )
}

export default NavBar;

