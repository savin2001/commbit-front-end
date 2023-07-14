/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Loading from "../../components/data_fetch_state/Loading";
import SideMenu from "../../components/side_menu/SideMenu";
import PropTypes from "prop-types";
import Error from "../../components/data_fetch_state/Error";
import axios from "axios";
import useFetchBackendRoute from "../../components/backend_connection/useFetchBackendRoute";
import { BsDownload } from "react-icons/bs";
import { getDownloadURL, ref } from "firebase/storage";
import { store } from "../firebase/firebase";

const Documents = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [docs, setDocs] = useState(null);

  const backend = useFetchBackendRoute();
  const docsList = `${backend}/docs/all`;

  useEffect(() => {
    fetchDocs();
    if (!user) {
      // Handle the case when the user is not found
      setError({ message: "No user data found" });
    }
    setLoading(false);
  }, []);

  const fetchDocs = async () => {
    try {
      const response = await axios.get(docsList);
      setDocs(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Download files
  const downloadDoc = (fileName, fileURL) => {
    if (!fileName) {
      return setError("Kindly choose a file to download");
    }
    console.log(fileName, fileURL);
    getDownloadURL(ref(store, fileURL))
      .then((url) => {
        // `url` is the download URL for the file
        window.open(url, "_blank");
        setError("");
        // This can be downloaded directly:
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = "blob";
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open("GET", url);
        // xhr.send();
      })
      .catch((err) => {
        // A list of error codes
        switch (err.code) {
          case "storage/object-not-found":
            setError(err.message);
            break;
          case "storage/unauthorized":
            setError(err.message);
            break;
          case "storage/canceled":
            setError(err.message);
            break;
          case "storage/unknown":
            setError(err.message);
            break;
        }
      });
  };

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
                    {/* Docs */}
                    <div className="mb-5 mt-3">
                      <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
                        Document List
                      </h3>
                      <div className="flex flex-wrap md:flex-nowrap w-full justify-center md:justify-start gap-4 sm:gap-8">
                        <div className="overflow-x-auto">
                          <table className="table w-full md:w-screen max-w-5xl">
                            {/* head */}
                            <thead>
                              <tr>
                                <th>id</th>
                                <th>filename</th>
                                <th>uploaded_by</th>
                                <th>downLoad</th>
                              </tr>
                            </thead>

                            <tbody>
                              {docs && (
                                <>
                                  {docs?.map((doc) => (
                                    <tr className="hover" key={doc.id}>
                                      <th>{doc.id}</th>
                                      <td>{doc.filename}</td>
                                      <td>{doc.user_email}</td>
                                      <td>
                                        <button
                                          className="btn bt-sm btn-primary btn-outline"
                                          onClick={() => {
                                            downloadDoc(
                                              doc.filename,
                                              doc.file_url
                                            );
                                          }}
                                        >
                                          <BsDownload className="h-6 w-6" />
                                        </button>
                                      </td>
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
Documents.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default Documents;
