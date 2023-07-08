import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ContentMgrDashBoard = ({ user }) => {
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
              <div className="stat-value text-neutral">0</div>
            </div>
          </Link>
          <Link
            to={`/${user.user_type}/documents`}
            className="stats shadow-md w-full sm:max-w-xs md:w-1/2 text-base-100"
          >
            <div className="stat">
              <div className="stat-title">Total Documents</div>
              <div className="stat-value text-neutral">0</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-5">
        <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
          Documents
        </h3>
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
          <div className="stats shadow-md w-full sm:max-w-xs md:w-1/3  bg-info text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">My documents</div>
              <div className="stat-value">0</div>
            </div>
          </div>
          <div className="stats shadow-md w-full sm:max-w-xs md:w-1/3 bg-warning text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">Shared documents</div>
              <div className="stat-value">0</div>
            </div>
          </div>
          <div className="stats shadow-md w-full sm:max-w-xs md:w-1/3 bg-success text-base-100">
            <div className="stat">
              <div className="stat-title text-base-100">Reports</div>
              <div className="stat-value">0</div>
            </div>
          </div>
        </div>
      </div>
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
