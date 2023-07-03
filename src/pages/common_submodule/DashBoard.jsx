import { useEffect, useState } from "react";
import Navbar from "../../components/navbars/Navbar";
import Loading from "../../components/data_fetch_state/Loading";
import AdminDashBoard from "../../components/dashboards/AdminDashBoard";
import BackOfficeDashBoard from "../../components/dashboards/BackOfficeDashBoard";
import SideMenu from "../../components/side_menu/SideMenu";
import EventMgrDashBoard from "../../components/dashboards/EventMgrDashBoard";
import ContentMgrDashBoard from "../../components/dashboards/ContentMgrDashBoard";

const DashBoard = () => {
  const userRole = ["admin", "content_manager", "event_manager", "back_office"];
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("upd");
    if (storedUser) {
      const user_det = JSON.parse(storedUser);
      setUser(user_det);
      setUserType(user_det.user_type);
    } else {
      // Handle the case when the "upd" item is not found in localStorage
      // console.log("No user data found");
    }
    setLoading(false);
  }, []); // Removed `user` dependency

  if(user != null)
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar />

          <div className="mx-auto">
            <div className="mx-auto ">
              <div className="drawer drawer-mobile">
                <input
                  id="my-drawer-2"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6 sm:px-6 lg:px-8">
                  <header className="w-full">
                    <h2 className="my-6 text-left text-3xl font-extrabold text-neutral capitalize">
                      Welcome {user && user.first_name}
                    </h2>
                  </header>
                  <main className="w-full">
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-accent border-dashed rounded-md">
                      {/* {console.log("userType:", userType)} */}
                      {userType === userRole[0] && <AdminDashBoard />}
                      {userType === userRole[1] && <ContentMgrDashBoard />}
                      {userType === userRole[2] && <EventMgrDashBoard />}
                      {userType === userRole[3] && <BackOfficeDashBoard />}
                    </div>
                  </main>
                </div>
                <SideMenu />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashBoard;
