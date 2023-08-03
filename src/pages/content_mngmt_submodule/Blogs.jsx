import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/navbars/Navbar";
import Loading from "../../components/data_fetch_state/Loading";
import ContentCreation from "../../components/content/ContentCreation";
import ContentList from "../../components/content/ContentList";
import SideMenu from "../../components/side_menu/SideMenu";
import Error from "../../components/data_fetch_state/Error";

const Blogs = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    if (!user) {
      // Handle the case when the user is not found
      setError({ message: "No user data found" });
    }
    setLoading(false);
  }, [user]);
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
                    
                    <SideMenu /> {/* Render the SideMenu */}
                      {/* Render the content if user data exists */}
                      <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6 sm:px-6 lg:px-8 p-4">
                        <header className="w-full">
                          <h2 className="my-6 text-left text-3xl font-extrabold text-neutral capitalize">
                            Blogs
                          </h2>
                        </header>
                        <main className="w-full">
                          <div className="flex flex-col justify-center pb-6">
                            <ContentCreation user={user} /> {/* Render the DocUpload component */}
                            <ContentList user={user}/>
                          </div>
                        </main>
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
          </div>
        </>
      )}
    </>
  );
}

// Prop Types
Blogs.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default Blogs