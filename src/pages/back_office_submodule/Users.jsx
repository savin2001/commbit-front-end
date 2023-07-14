/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Navbar from "../../components/navbars/Navbar";
import Loading from "../../components/data_fetch_state/Loading";
import SideMenu from "../../components/side_menu/SideMenu";
import PropTypes from "prop-types";
import Error from "../../components/data_fetch_state/Error";
import axios from "axios";
import useFetchBackendRoute from "../../components/backend_connection/useFetchBackendRoute";

const Documents = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [countUsers, setCountUsers] = useState(0);
  const [users, setUsers] = useState(null);
  const [usr, setUsr] = useState({
    del_flg: "N",
  });

  const backend = useFetchBackendRoute();
  const userCount = `${backend}/users/count`;
  const usersList = `${backend}/users/all`;
  const disable = `${backend}/users/disable`;
  const enable = `${backend}/users/enable`;
  const handleToggle = () => {
    setUsr((prevUser) => {
      const newDelFlg = prevUser.del_flg === "Y" ? "N" : "Y";
      return {
        ...prevUser,
        del_flg: newDelFlg,
      };
    });
  };

  useEffect(() => {
    fetchUserCount();
    fetchUsers();
    if (!user) {
      // Handle the case when the user is not found
      setError({ message: "No user data found" });
    }
    setLoading(false);
  }, [ usr]);

  const fetchUserCount = async () => {
    try {
      const response = await axios.get(userCount);
      setCountUsers(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(usersList);
      setUsers(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Function to disable a user
  const disableUser = async (email) => {
    try {
      await axios.put(disable, { email });
      // Handle success or any other logic
      handleToggle()
    } catch (error) {
      // Handle error
    }
  };

  // Function to enable a user
  const enableUser = async (email) => {
    try {
      await axios.put(enable, { email });
      // Handle success or any other logic
      handleToggle()
    } catch (error) {
      // Handle error
    }
  };

  
  

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
                      <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6 sm:px-6 lg:px-8 max-w-7xl p-3">
                        <header className="w-full">
                          <h2 className="my-6 text-left text-3xl font-extrabold text-neutral capitalize">
                            Users
                          </h2>
                        </header>
                        <div className="mb-8 w-full">
                          {/* Users */}
                          <div className="mb-5 mt-3">
                            <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                              <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-success text-base-100">
                                <div className="stat">
                                  <div className="stat-title text-base-100">
                                    Active Users
                                  </div>
                                  <div className="stat-value">
                                    {countUsers ? countUsers.totalActive : 0}
                                  </div>
                                </div>
                              </div>
                              <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-secondary text-base-100">
                                <div className="stat">
                                  <div className="stat-title text-base-100">
                                    Disabled Users
                                  </div>
                                  <div className="stat-value">
                                    {countUsers ? countUsers.totalDisabled : 0}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-5 mt-3">
                            <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
                              User details
                            </h3>
                            <div className="flex flex-wrap md:flex-nowrap w-full justify-center md:justify-start gap-4 sm:gap-8">
                              <div className="overflow-x-auto">
                                <table className="table w-full">
                                  {/* head */}
                                  <thead>
                                    <tr>
                                      <th>id</th>
                                      <th>first_name last_name</th>
                                      <th>email</th>
                                      <th>phone</th>
                                      <th>status</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {users && (
                                      <>
                                        {users?.map((user) => (
                                          <tr className="hover" key={user.id}>
                                            <th>{user.id}</th>
                                            <td>{`${user.first_name} ${user.last_name}`}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone_number}</td>
                                            <td>
                                              <input
                                                type="checkbox"
                                                className="toggle toggle-success rounded-full"
                                                checked={user.del_flg !== "Y"}
                                                onChange={() => {
                                                  if (user.del_flg === "Y") {
                                                    enableUser(user.email);
                                                  } else {
                                                    disableUser(user.email);
                                                  }
                                                }}
                                              />
                                            </td>
                                          </tr>
                                        ))}
                                      </>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
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
                              <Error error={error} />{" "}
                              {/* Render the Error component */}
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
Documents.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default Documents;
