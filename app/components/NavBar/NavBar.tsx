import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '~/img/logo192.png';
import { SignOutButton } from '~/components';
import ThemeSelector from "./ThemeSelector";

const Logo = () => {
  return (

    <svg className="logo" width="40" height="40" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path className="fill-secondary" fillRule="evenodd" clipRule="evenodd" d="M151.346 121.054C150.565 121.835 150.565 123.101 151.346 123.883L195.165 167.701C195.946 168.482 195.946 169.749 195.165 170.53L151.357 214.337C150.576 215.118 150.576 216.384 151.357 217.165L171.156 236.964C171.937 237.745 173.204 237.745 173.985 236.964L220.246 190.703C220.329 190.62 220.421 190.546 220.511 190.471C220.556 190.433 220.6 190.393 220.643 190.351L240.442 170.552C240.737 170.256 240.921 169.891 240.993 169.51C241.133 168.867 240.953 168.168 240.453 167.668L220.654 147.869C220.602 147.817 220.548 147.768 220.492 147.723C220.379 147.633 220.263 147.545 220.161 147.442L173.974 101.255C173.193 100.474 171.926 100.474 171.145 101.255L151.346 121.054Z" fill="white" />
      <path className="fill-primary" fillRule="evenodd" clipRule="evenodd" d="M106.446 78.9091V236.232C106.446 237.337 105.551 238.232 104.446 238.232H76.4464C75.3419 238.232 74.4464 237.337 74.4464 236.232V78.8958L45.2285 108.114C44.4474 108.895 43.1811 108.895 42.4 108.114L22.5999 88.3137C21.8189 87.5326 21.8189 86.2663 22.5999 85.4853L68.8479 39.2372C68.9349 39.0838 69.0438 38.9395 69.1745 38.8087L88.9735 19.0097C89.4164 18.5668 90.0154 18.3751 90.5935 18.4345C91.0676 18.4608 91.5342 18.655 91.8964 19.0172L111.697 38.8173C111.817 38.9379 111.919 39.0701 112.002 39.2102L158.27 85.4778C159.051 86.2588 159.051 87.5252 158.27 88.3062L138.471 108.105C137.69 108.886 136.424 108.886 135.643 108.105L106.446 78.9091Z" fill="black" />
    </svg>
  )
}

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
          <Logo />
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

