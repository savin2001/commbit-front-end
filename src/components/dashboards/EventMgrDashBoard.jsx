import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useFetchBackendRoute from "../backend_connection/useFetchBackendRoute";
import axios from "axios";
import Error from "../data_fetch_state/Error";
import SideMenu from "../side_menu/SideMenu";

const EventMgrDashBoard = ({ user }) => {
  const [countEvents, setCountEvents] = useState(0);
  const [error, setError] = useState(true);

  const backend = useFetchBackendRoute();

  const docsCount = `${backend}/events/count`;

  useEffect(() => {
    fetchEventsCount();
  }, []);

  const fetchEventsCount = async () => {
    try {
      const response = await axios.get(docsCount);
      setCountEvents(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="mb-8 w-full">
      {/* Summary of users and events */}

      {/* Events */}
      {countEvents && (
        <>
          {countEvents ? (
            <>
              <div className="mb-5">
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                  <Link
                    to={`/${user.user_type}/events`}
                    className="stats shadow-md w-full sm:max-w-xs md:w-full text-base-100"
                  >
                    <div className="stat">
                      <div className="stat-title">All events</div>
                      <div className="stat-value text-neutral">
                        {countEvents ? countEvents.total : 0}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="mb-5 mt-3">
                <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
                  Events
                </h3>
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                  <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-success text-base-100">
                    <div className="stat">
                      <div className="stat-title text-base-100">
                        Active Events
                      </div>
                      <div className="stat-value">
                        {countEvents ? countEvents.totalActive : 0}
                      </div>
                    </div>
                  </div>
                  <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-secondary text-base-100">
                    <div className="stat">
                      <div className="stat-title text-base-100">
                        Finished Events
                      </div>
                      <div className="stat-value">
                        {countEvents ? countEvents.totalDisabled : 0}
                      </div>
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
  );
};

// Prop Types
EventMgrDashBoard.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default EventMgrDashBoard;
