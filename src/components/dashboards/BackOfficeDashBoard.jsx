/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useFetchBackendRoute from "../backend_connection/useFetchBackendRoute";
import axios from "axios";
import Error from "../data_fetch_state/Error";
import SideMenu from "../side_menu/SideMenu";

const BackOfficeDashBoard = ({ user }) => {
  const [countDocs, setCountDocs] = useState(0);
  const [error, setError] = useState(true);

  const backend = useFetchBackendRoute();

  const docsCount = `${backend}/docs/count/${user.email}`;

  useEffect(() => {
    fetchDocsCount();
  }, [user]);

  const fetchDocsCount = async () => {
    try {
      // console.log(user.email)
      const response = await axios.get(docsCount, { email: user.email });
      setCountDocs(response.data);
      // console.log(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="mb-8 w-full">
      {/* Summary of users and documents */}

      {/* Documents */}
      {countDocs && (
        <>
          {countDocs ? (
            <>
              <div className="mb-5">
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                  <Link
                    to={`/${user.user_type}/documents`}
                    className="stats shadow-md w-full sm:max-w-xs md:w-full text-base-100"
                  >
                    <div className="stat">
                      <div className="stat-title">All documents</div>
                      <div className="stat-value text-neutral">
                        {countDocs ? countDocs.total : 0}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="mb-5 mt-3">
                <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
                  Documents
                </h3>
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                  <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-success text-base-100">
                    <div className="stat">
                      <div className="stat-title text-base-100">
                        My Documents
                      </div>
                      <div className="stat-value">
                        {countDocs ? countDocs.totalMine : 0}
                      </div>
                    </div>
                  </div>
                  <div className="stats shadow-md w-full sm:max-w-xs md:max-w-md md:w-1/2 bg-secondary text-base-100">
                    <div className="stat">
                      <div className="stat-title text-base-100">
                        Shared Documents
                      </div>
                      <div className="stat-value">
                        {countDocs ? countDocs.totalShared : 0}
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
BackOfficeDashBoard.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default BackOfficeDashBoard;
