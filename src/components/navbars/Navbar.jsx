import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  // User state
  const [currentUser, setCurrentUser] = useState(null);

  // Check if the user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <div className="navbar bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 shadow-lg fixed z-50">
      <div className="navbar-start">
        <div className="dropdown">
          {!currentUser?.emailVerified ? (
            <>
              <label tabIndex={0} className="btn btn-white lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
            </>
          ) : (
            <>
              <label htmlFor="my-drawer-2" className="btn btn-white lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
            </>
          )}
        </div>
        <Link to={"/"} className="btn btn-ghost normal-case text-2xl text-white lg:text-3xl">
          <span>Comm</span>
          <span className=" text-black">Bit</span>
        </Link>
      </div>

      <div className="navbar-end">
        {!currentUser?.emailVerified ? (
          <>
            <Link
              to={"/login"}
              className="btn btn-sm btn-primary font-bold text-base lg:text-lg"
            >
              Get started
            </Link>
          </>
        ) : (
          <>
            <span
              className="btn btn-sm btn-error font-bold text-base lg:text-lg"
              onClick={() => {
                localStorage.removeItem("upd");
                signOut(auth);
              }}
            >
              Sign Out
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
