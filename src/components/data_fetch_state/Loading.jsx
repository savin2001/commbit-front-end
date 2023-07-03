import { FaSpinner } from "react-icons/fa";
const Loading = () => {
  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="shadow-xl p-10 h-96 max-h-screen max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://api.dicebear.com/6.x/identicon/svg?seed=Ange"
          alt="avatar"
        />
        <h3 className="mt-9 lg:text-2xl sm:text-xl text-primary pb-6 text-center">
          Just a moment...
        </h3>

        <div className="flex justify-center items-center h-3/4">
          <FaSpinner className="h-1/4 w-1/4 text-primary animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
