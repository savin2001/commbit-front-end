/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Loading from "../../components/data_fetch_state/Loading";
import SideMenu from "../../components/side_menu/SideMenu";
import PropTypes from "prop-types";
import Error from "../../components/data_fetch_state/Error";
import axios from "axios";
import useFetchBackendRoute from "../../components/backend_connection/useFetchBackendRoute";

const EventList = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [events, setEvents] = useState(null);

  const backend = useFetchBackendRoute();
  const eventsList = `${backend}/events/all`;

  useEffect(() => {
    fetchEvents();
    if (!user) {
      // Handle the case when the user is not found
      setError({ message: "No user data found" });
    }
    setLoading(false);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(eventsList);
      setEvents(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const dateFormatter = (inputDte) => {
    const date = new Date(inputDte);
    const options = { day: "2-digit", month: "short", year: "2-digit" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  const timeFormatter = (inputTime) =>{
    const time = inputTime;
const options = { hour: 'numeric', minute: '2-digit', hour12: true };
const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', options);

return formattedTime;

  }

  return (
    <>
      {loading ? (
        <Loading /> // Display the loading state if data is still loading
      ) : (
        <>
          {user && (
            <>
              {user ? (
                <>
                  {/* Render the content if user data exists */}
                  <div className="mb-8 w-full">
                    {/* Events */}
                    <div className="mb-5 mt-3">
                      <h3 className="mt-8 text-left text-xl font-extrabold text-neutral">
                        Event List
                      </h3>
                      <div className="flex flex-wrap md:flex-nowrap w-full justify-center md:justify-start gap-4 sm:gap-8">
                        <div className="overflow-x-auto">
                          <table className="table w-full md:w-screen max-w-5xl">
                            {/* head */}
                            <thead>
                              <tr>
                                <th>Event</th>
                                <th>Location</th>
                                <th>Start date</th>
                                <th>End date</th>
                                <th>Duration</th>
                              </tr>
                            </thead>

                            <tbody>
                              {events && (
                                <>
                                  {events?.map((event) => (
                                    <tr
                                      className="hover cursor-pointer"
                                      key={event.id}
                                      onClick={() => {}}
                                    >
                                      <td>{event.title}</td>
                                      <td>{event.location}</td>
                                      <td>{dateFormatter(event.start_date)}</td>
                                      <td>{dateFormatter(event.end_date)}</td>
                                      <td>{`${timeFormatter(event.start_time)} - ${timeFormatter(event.end_time)}`}</td>
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
        </>
      )}
    </>
  );
};

// Prop Types
EventList.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default EventList;
