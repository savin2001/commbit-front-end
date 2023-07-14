import { useEffect, useState } from "react";
import Navbar from "../../components/navbars/Navbar";
import Loading from "../../components/data_fetch_state/Loading";
import AdminDashBoard from "../../components/dashboards/AdminDashBoard";
import BackOfficeDashBoard from "../../components/dashboards/BackOfficeDashBoard";
import SideMenu from "../../components/side_menu/SideMenu";
import EventMgrDashBoard from "../../components/dashboards/EventMgrDashBoard";
import ContentMgrDashBoard from "../../components/dashboards/ContentMgrDashBoard";
import PropTypes from "prop-types";
import Error from "../../components/data_fetch_state/Error";

const DashBoard = ({ user }) => {
  const userRole = ["admin", "content_manager", "event_manager", "back_office"];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (user) {
      setUserType(user.user_type);
    } else {
      // Handle the case when the user is not found
      setError({ message: "No user data found" });
    }
    setLoading(false);
  }, [user]);

  return (
    <>
      {loading ? (
        <Loading /> // Display the loading state if data is still loading
      ) : (
        <>
          <Navbar /> {/* Render the Navbar */}
          <div className="mx-auto ">
            <div className="drawer drawer-mobile">
              <input
                id="my-drawer-2"
                type="checkbox"
                className="drawer-toggle"
              />
              {user && (
                <>
                  {user ? (
                    <>
                      {/* Render the content if user data exists */}
                      <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6  lg:px-8">
                        <header className="w-full">
                          <h2 className="my-6 text-left text-3xl font-extrabold text-neutral capitalize">
                            Welcome {user && user.first_name}
                          </h2>
                        </header>
                        <main className="w-full">
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary border-dashed rounded-md  p-4">
                            {/* Render the appropriate dashboard based on user type */}
                            {userType === userRole[0] && (
                              <AdminDashBoard user={user} />
                            )}
                            {userType === userRole[1] && (
                              <ContentMgrDashBoard user={user} />
                            )}
                            {userType === userRole[2] && (
                              <EventMgrDashBoard user={user} />
                            )}
                            {userType === userRole[3] && (
                              <BackOfficeDashBoard user={user} />
                            )}
                          </div>
                        </main>
                      </div>
                      <SideMenu /> {/* Render the SideMenu */}
                    </>
                  ) : (
                    <>
                      {error && (
                        <>
                          {/* Render the error state */}
                          <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6 sm:px-6 lg:px-8">
                            <div className="flex w-full items-center justify-center">
                              <Error error={error} /> {/* Render the Error component */}
                            </div>
                          </div>
                          <SideMenu /> {/* Render the SideMenu */}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Prop Types
DashBoard.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.objectOf(PropTypes.any).isRequired,
    first_name: PropTypes.objectOf(PropTypes.any).isRequired,
    // Other user properties
  }).isRequired,
};

export default DashBoard;
