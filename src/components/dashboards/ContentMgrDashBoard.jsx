import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useFetchBackendRoute from "../backend_connection/useFetchBackendRoute";
import axios from "axios";
import Error from "../data_fetch_state/Error";
import SideMenu from "../side_menu/SideMenu";

const ContentMgrDashBoard = ({ user }) => {
  const [countContent, setCountContent] = useState(0);
  const [error, setError] = useState(true);

  const backend = useFetchBackendRoute();

  const contentCount = `${backend}/cms/count`;

  useEffect(() => {
    fetchContentCount();
  }, []);

  const fetchContentCount = async () => {
    try {
      const response = await axios.get(contentCount);
      setCountContent(response.data);
      // console.log(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="mb-8 w-full">
      {/* Summary of content and media */}
      {countContent && (
        <>
          {countContent ? (
            <>
              <div className="mb-5">
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                  <Link
                    to={`/${user.user_type}/blogs`}
                    className="stats shadow-md w-full sm:max-w-xs md:w-1/3 text-base-100"
                  >
                    <div className="stat">
                      <div className="stat-title">Total Blogs</div>
                      <div className="stat-value text-neutral">
                        {countContent ? countContent.total : 0}
                      </div>
                    </div>
                  </Link>
                  <Link
                    to={`/${user.user_type}/documents`}
                    className="stats shadow-md w-full sm:max-w-xs md:w-1/2 text-base-100"
                  >
                    <div className="stat">
                      <div className="stat-title">Total Media</div>
                      <div className="stat-value text-neutral">0</div>
                    </div>
                  </Link>
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
ContentMgrDashBoard.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default ContentMgrDashBoard;
