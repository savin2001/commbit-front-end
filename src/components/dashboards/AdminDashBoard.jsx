import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useFetchBackendRoute from "../backend_connection/useFetchBackendRoute";
import axios from "axios";

const AdminDashBoard = ({ user }) => {
  const [countUsers, setCountUsers] = useState(0);
  const [countDocs, setCountDocs] = useState(0);
  const [countEvents, setCountEvents] = useState(0);
  const backend = useFetchBackendRoute();

  const userCount = `${backend}/users/count`;
  const docsCount = `${backend}/docs/count`;
  const eventsCount = `${backend}/events/count`;

  useEffect(() => {
    fetchUserCount();
    fetchDocsCount();
    fetchEventsCount();
  }, [userCount, docsCount]);

  const fetchUserCount = async () => {
    try {
      const response = await axios.get(userCount);
      setCountUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const fetchDocsCount = async () => {
    try {
      const response = await axios.get(docsCount);
      setCountDocs(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const fetchEventsCount = async () => {
    try {
      const response = await axios.get(eventsCount);
      setCountEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="mb-8 w-full">
      {/* Summary of users and documents */}
      <div className="mb-5">
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
          <Link
            to={`/${user.user_type}/users`}
            className="stats shadow-md w-full sm:max-w-xs md:w-1/3 text-base-100"
          >
            <div className="stat">
              <div className="stat-title">Total Users</div>

              <div className="stat-value text-neutral">
                {countUsers ? countUsers.total : 0}
              </div>
            </div>
          </Link>
          <Link
            to={`/${user.user_type}/documents`}
            className="stats shadow-md w-full sm:max-w-xs md:w-1/2 text-base-100"
          >
            <div className="stat">
              <div className="stat-title">Total Documents</div>
              <div className="stat-value text-neutral">
                {countDocs ? countDocs.total : 0}
              </div>
            </div>
          </Link>
          <Link
            to={`/${user.user_type}/documents`}
            className="stats shadow-md w-full sm:max-w-xs md:w-1/2 text-base-100"
          >
            <div className="stat">
              <div className="stat-title">Total Events</div>
              <div className="stat-value text-neutral">
                {countEvents ? countEvents.total : 0}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Users */}
      <div className="mb-5 mt-3">
        <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
          Users
        </h3>
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
          <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-success text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">Active Users</div>
              <div className="stat-value">
                {countUsers ? countUsers.totalActive : 0}
              </div>
            </div>
          </div>
          <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-secondary text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">Disabled Users</div>
              <div className="stat-value">
                {countUsers ? countUsers.totalDisabled : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-5 mt-3">
        <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
          Documents
        </h3>
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
          <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-success text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">Shareable Documents</div>
              <div className="stat-value">
                {countDocs ? countDocs.totalActive : 0}
              </div>
            </div>
          </div>
          <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-secondary text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">Archived Documents</div>
              <div className="stat-value">
                {countDocs ? countDocs.totalDisabled : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="mb-5 mt-3">
        <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
          Event
        </h3>
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
          <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-success text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">Active Events</div>
              <div className="stat-value">
                {countEvents ? countEvents.totalActive : 0}
              </div>
            </div>
          </div>
          <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-secondary text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">Cancelled Events</div>
              <div className="stat-value">
                {countEvents ? countEvents.totalDisabled : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Types
AdminDashBoard.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default AdminDashBoard;
