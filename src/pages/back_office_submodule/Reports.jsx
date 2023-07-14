/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Navbar from "../../components/navbars/Navbar";
import Loading from "../../components/data_fetch_state/Loading";
import SideMenu from "../../components/side_menu/SideMenu";
import PropTypes from "prop-types";
import Error from "../../components/data_fetch_state/Error";
import axios from "axios";
import useFetchBackendRoute from "../../components/backend_connection/useFetchBackendRoute";
import { BsDownload } from "react-icons/bs";
import { ExportToCsv } from "export-to-csv";

const Reports = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [users, setUsers] = useState(null);
  const [docs, setDocs] = useState(null);
  const [events, setEvents] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);
  const [inactiveUsers, setInactiveUsers] = useState(null);

  const backend = useFetchBackendRoute();
  const userListEndpoint = `${backend}/users/all`;
  const docListEndpoint = `${backend}/docs/all`;
  const eventListEndpoint = `${backend}/events/all`;
  const activeUsersEndpoint = `${backend}/users/active`;
  const inactiveUsersEndpoint = `${backend}/users/disable`;

  useEffect(() => {
    fetchUsers();
    fetchDocs();
    fetchEvents();
    fetchActiveUsers();
    fetchInactiveUsers();

    if (!users) {
      // Handle the case when user data is not found
      setError({ message: "No user data found" });
    }
    if (!docs) {
      // Handle the case when doc data is not found
      setError({ message: "No doc data found" });
    }
    if (!events) {
      // Handle the case when event data is not found
      setError({ message: "No event data found" });
    }
    if (!activeUsers) {
      // Handle the case when active user data is not found
      setError({ message: "No active user data found" });
    }
    if (!inactiveUsers) {
      // Handle the case when inactive user data is not found
      setError({ message: "No inactive user data found" });
    }

    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(userListEndpoint);
      setUsers(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const fetchDocs = async () => {
    try {
      const response = await axios.get(docListEndpoint);
      setDocs(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(eventListEndpoint);
      setEvents(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await axios.get(activeUsersEndpoint);
      setActiveUsers(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const fetchInactiveUsers = async () => {
    try {
      const response = await axios.get(inactiveUsersEndpoint);
      setInactiveUsers(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const downloadCSV = (data, title) => {
    const arr = data;
    // eslint-disable-next-line no-unused-vars
    const newArr = arr.map(({ download_url, new_download_url, ...rest }) => {
      return rest;
    });
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: title,
      filename: title,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    if (newArr.length > 0) {
      csvExporter.generateCsv(newArr);
      setError("");
    } else {
      setError("Data not present");
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
                        <div className="w-full mb-8">
                          <header className="w-full">
                            <h2 className="my-6 text-left text-3xl font-extrabold text-primary capitalize">
                              Reports
                            </h2>
                            <p className="my-6 text-left italic font-extrabold text-secondary capitalize">
                              Click the card to download its report
                            </p>
                          </header>
                        </div>
                        <div className="w-full mb-8">
                          <header className="w-full">
                            <h3 className="my-6 text-left text-2xl font-extrabold text-neutral capitalize">
                              Users Reports
                            </h3>
                          </header>
                          <div className="mb-8 w-full">
                            {/* Users */}
                            <div className="mb-5 mt-3">
                              <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                                <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-base-100 text-neutral">
                                  <div
                                    className="stat cursor-pointer"
                                    onClick={(e) => {
                                      e && e.preventDefault;
                                      const title = "Total Users";
                                      downloadCSV(users, title);
                                    }}
                                  >
                                    <div className="stat-title">
                                      Total Users
                                    </div>
                                    <div className="stat-value mt-2 p-4">
                                      <button className="btn w-full btn-primary btn-outline">
                                        <BsDownload className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-success text-base-100">
                                  <div
                                    className="stat cursor-pointer"
                                    onClick={(e) => {
                                      e && e.preventDefault;
                                      const title = "Active Users";
                                      downloadCSV(activeUsers, title);
                                    }}
                                  >
                                    <div className="stat-title text-base-100">
                                      Active Users
                                    </div>
                                    <div className="stat-value mt-2 p-4">
                                      <button className="btn w-full btn-neutral btn-outline">
                                        <BsDownload className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-secondary text-base-100">
                                  <div
                                    className="stat cursor-pointer"
                                    onClick={(e) => {
                                      e && e.preventDefault;
                                      const title = "Disabled Users";
                                      downloadCSV(inactiveUsers, title);
                                    }}
                                  >
                                    <div className="stat-title text-base-100">
                                      Disabled Users
                                    </div>
                                    <div className="stat-value mt-2 p-4">
                                      <button className="btn w-full btn-outline">
                                        <BsDownload className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full mb-8">
                          <header className="w-full">
                            <h3 className="my-6 text-left text-2xl font-extrabold text-neutral capitalize">
                              Other Reports
                            </h3>
                          </header>
                          <div className="mb-8 w-full">
                            {/* Users */}
                            <div className="mb-5 mt-3">
                              <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                                <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-base-100 text-neutral">
                                  <div
                                    className="stat cursor-pointer"
                                    onClick={(e) => {
                                      e && e.preventDefault;
                                      const title = "Total Documents";
                                      downloadCSV(docs, title);
                                    }}
                                  >
                                    <div className="stat-title">
                                      All Documents
                                    </div>
                                    <div className="stat-value mt-2 p-4">
                                      <button className="btn w-full btn-primary btn-outline">
                                        <BsDownload className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-base-100 text-neutral">
                                  <div
                                    className="stat cursor-pointer"
                                    onClick={(e) => {
                                      e && e.preventDefault;
                                      const title = "All Events";
                                      downloadCSV(events, title);
                                    }}
                                  >
                                    <div className="stat-title">
                                      All Events
                                    </div>
                                    <div className="stat-value mt-2 p-4">
                                      <button className="btn w-full btn-primary btn-outline">
                                        <BsDownload className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
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
Reports.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default Reports;
