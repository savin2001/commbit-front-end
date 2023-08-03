 import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth"

const SideMenu = () => {
  let user = JSON.parse(localStorage.getItem("upd"));
  const userRole = ["admin", "content_manager", "event_manager", "back_office"];
  if(user)
  return (
    <>
      <div className="drawer-side mt-16 bg-slate-200 ">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto sm:w-1/2 md:w-80 bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 shadow-lg sticky text-white lg:text-xl mb-5 capitalize">
          <li>
            <Link className="lg:mb-3" to={`/${user.user_type}/dashboard`}>Dashboard</Link>
          </li>         

          {user.user_type === userRole[0] && (
            <>
              <li>
                <Link className="lg:mb-3" to={`/${user.user_type}/users`}>Users</Link>
              </li>
              <li>
                <Link className="lg:mb-3" to={`/${user.user_type}/reports`}>Reports</Link>
              </li>
            </>
          )}
          {user.user_type === userRole[1] && (
            <>
              <li>
                <Link className="lg:mb-3" to={`/${user.user_type}/blogs`}>blogs</Link>
              </li>
              {/* <li>
                <Link className="lg:mb-3" to={`/${user.user_type}/media`}>media</Link>
              </li> */}
            </>
          )}
          {user.user_type === userRole[2] && (
            <>
              <li>
                <Link className="lg:mb-3" to={`/${user.user_type}/events`}>events</Link>
              </li>
              <li>
                {/* <Link className="lg:mb-3" to={`/${user.user_type}/participants`}>participants</Link> */}
              </li>
            </>
          )}
          {user.user_type === userRole[3] && (
            <>
              <li>
                <Link className="lg:mb-3" to={`/${user.user_type}/documents`}>documents</Link>
              </li>
              <li>
                <Link className="lg:mb-3" to={`/${user.user_type}/doc-reports`}>Reports</Link>
              </li>
            </>
          )}
          
          <li>
            <Link className="lg:mb-3" to={`/${user.user_type}/profile`}>My Profile</Link>
          </li>
          <li className="bg-error rounded-md text-base-100 lg:mb-3">
            <span
              onClick={() => {
                localStorage.removeItem("upd");
                signOut(auth);
              }}
            >
              Sign Out
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SideMenu;