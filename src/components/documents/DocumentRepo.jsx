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
  const [docsMine, setDocsMine] = useState(null);
  const [docsShared, setDocsShared] = useState(null);

  const backend = useFetchBackendRoute();
  const docsList = `${backend}/docs/all`;
  const docsMineList = `${backend}/docs/mine/${user.email}`;
  const docsSharedList = `${backend}/docs/shared/${user.email}`;

  useEffect(() => {
    fetchDocs();
    fetchMyDocs();
    fetchSharedDocs();
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
      setError(error.response.data.message);
    }
  };

  const fetchMyDocs = async () => {
    try {
      const response = await axios.get(docsMineList, { email: user.email });
      // console.log("My docs", response.data);
      setDocsMine(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  const fetchSharedDocs = async () => {
    try {
      const response = await axios.get(docsSharedList, { email: user.email });
      // console.log("Shared docs", response.data);
      setDocsShared(response.data);
    } catch (error) {
      setError(error.response.data.message);
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
                      <details className="collapse collapse-open bg-base-200 max-w-5xl my-6">
                        <summary className="collapse-title text-xl font-medium">
                          All Documents
                        </summary>
                        <div className="collapse-content">
                          <div className="overflow-x-auto">
                            <table className="table w-full md:w-full max-w-5xl">
                              {/* head */}
                              <thead>
                                <tr>
                                  <th>id</th>
                                  <th>filename</th>
                                  <th>uploaded_by</th>
                                  <th>email</th>
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
                                        <td>{doc.uploaded_by}</td>
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
                      </details>
                      <details className="collapse collapse-open bg-base-200 max-w-5xl my-6">
                        <summary className="collapse-title text-xl font-medium">
                          My Documents
                        </summary>
                        <div className="collapse-content">
                          <div className="overflow-x-auto">
                            <table className="table w-full md:w-full max-w-5xl">
                              {/* head */}
                              <thead>
                                <tr>
                                  <th>id</th>
                                  <th>filename</th>
                                  <th>uploaded_by</th>
                                  <th>email</th>
                                  <th>downLoad</th>
                                </tr>
                              </thead>

                              <tbody>
                                {docsMine && (
                                  <>
                                    {docsMine?.map((doc) => (
                                      <tr className="hover" key={doc.id}>
                                        <th>{doc.id}</th>
                                        <td>{doc.filename}</td>
                                        <td>{doc.uploaded_by}</td>
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
                      </details>
                      <details className="collapse collapse-open bg-base-200 max-w-5xl my-6">
                        <summary className="collapse-title text-xl font-medium">
                          Shared Documents
                        </summary>
                        <div className="collapse-content">
                          <div className="overflow-x-auto">
                            <table className="table w-full md:w-full max-w-5xl">
                              {/* head */}
                              <thead>
                                <tr>
                                  <th>id</th>
                                  <th>filename</th>
                                  <th>uploaded_by</th>
                                  <th>email</th>
                                  <th>downLoad</th>
                                </tr>
                              </thead>

                              <tbody>
                                {docsShared && (
                                  <>
                                    {docsShared?.map((doc) => (
                                      <tr className="hover" key={doc.id}>
                                        <th>{doc.id}</th>
                                        <td>{doc.filename}</td>
                                        <td>{doc.uploaded_by}</td>
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
                      </details>
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
