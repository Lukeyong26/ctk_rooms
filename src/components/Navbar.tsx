import { useState } from "react";

import { useAuthStore } from "../utils/store";

export default function MainNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  return (
    <div className="w-full navbar bg-main dark:bg-mainDark shadow-sm">
      <div className="flex-1 flex-col px-4 text-gray-200">
        <a href="/" className="text-xl font-semibold p-2 rounded-lg">CTK Rooms</a> 
      </div>
      <div className="flex-none">
        {/* Desktop Menu */}
        <ul className="hidden md:flex menu menu-horizontal px-4 text-xs md:text-lg">
          <li><a href="/">Home</a></li>
          <li><a href="/calendar">Calendar</a></li>
          
          {user ? (
            <>
              {isAdmin && (<>
                  <li><a href="/weekly">Week View</a></li>
                  <li><a href="/admin">Admin</a></li>
                </>)
              }
              <li><a href="profile">User</a></li>
            </>
          ) : (<li><a href="/auth/login">Login</a></li>)}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="btn btn-square btn-ghost md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <ul className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-lg p-2 text-lg z-10">
            <li><a href="/">Home</a></li>
            <li><a href="/calendar">Calendar</a></li>
            {/* <li><a href="/rooms" className="block py-2 px-4 hover:bg-base-200">Available Rooms</a></li> */}
            {user ? (
            <>
              {isAdmin && <li><a href="/admin">Admin</a></li>}
              <li><a href="profile">User</a></li>
            </>
          ) : (<li><a href="/auth/login">Login</a></li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
