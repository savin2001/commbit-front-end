import { BiErrorCircle } from "react-icons/bi";

import PropTypes from "prop-types";
const Error = ({ error }) => {
  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="shadow-xl p-10 h-96 max-h-screen max-w-md">
        <BiErrorCircle className="mx-auto h-12 text-error w-auto animate-pulse" />
        <h3 className="mt-9 lg:text-2xl sm:text-xl text-error pb-6 text-center">
          {error.message}
        </h3>
      </div>
    </div>
  );
};

// Prop Types
Error.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
};

export default Error;
