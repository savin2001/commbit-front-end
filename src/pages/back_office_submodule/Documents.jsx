import { useEffect, useState } from "react";
import Navbar from "../../components/navbars/Navbar";
import Loading from "../../components/data_fetch_state/Loading";
import SideMenu from "../../components/side_menu/SideMenu";
import PropTypes from "prop-types";
import Error from "../../components/data_fetch_state/Error";

const Documents = ({ user }) => {
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
        <Loading />
      ) : (
        <>
          <Navbar />
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
                      <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6 sm:px-6 lg:px-8">
                        <header className="w-full">
                          <h2 className="my-6 text-left text-3xl font-extrabold text-neutral capitalize">
                            Documents
                          </h2>
                        </header>
                        <main className="w-full">
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6"></div>
                        </main>
                      </div>
                      <SideMenu />
                    </>
                  ) : (
                    <>
                      <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6 sm:px-6 lg:px-8">
                        <div className="flex w-full items-center justify-center">
                          <Error error={error} />
                        </div>
                      </div>
                      <SideMenu />
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
Documents.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default Documents;
