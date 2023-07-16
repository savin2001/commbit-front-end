/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Navbar from "../../components/navbars/Navbar";
import Loading from "../../components/data_fetch_state/Loading";
import SideMenu from "../../components/side_menu/SideMenu";
import PropTypes from "prop-types";
import Error from "../../components/data_fetch_state/Error";
import axios from "axios";
import useFetchBackendRoute from "../../components/backend_connection/useFetchBackendRoute";
import { BsDownload } from "react-icons/bs";
import { ExportToCsv } from "export-to-csv";

const DocReports = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [docs, setDocs] = useState(null);
  const [docsMine, setDocsMine] = useState(null);
  const [docsShared, setDocsShared] = useState(null);
  const [docsBySub, setDocsBySub] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");

  const backend = useFetchBackendRoute();
  const docsList = `${backend}/docs/all`;
  const docsMineList = `${backend}/docs/mine/${user.email}`;
  const docsSharedList = `${backend}/docs/shared/${user.email}`;
  const subWithDocsCount = `${backend}/docs/sub-with-docs`;

  useEffect(() => {
    fetchDocs();
    fetchMyDocs();
    fetchSharedDocs();
    fetchSubDocsCount();
    if (subCategory) {
      const docsBySub = `${backend}/docs/sub/${subCategory}`;
      const fetchDocsBySub = async () => {
        try {
          console.log(subCategory);
          const response = await axios.get(docsBySub);
          setDocsBySub(response.data);

          // Call downloadCSV here with the updated docsBySub value
          const title = `Documents in ${subCategory}`;
          downloadCSV(response.data, title);
        } catch (error) {
          setError(error.response.data.message);
        }
      };
      fetchDocsBySub();
    }

    if (!docs) {
      // Handle the case when doc data is not found
      setError({ message: "No doc data found" });
    }

    setLoading(false);
  }, [user, subCategory]);

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

  const fetchSubDocsCount = async () => {
    try {
      // console.log(user.email)
      const response = await axios.get(subWithDocsCount);
      setSubcategories(response.data);
      // console.log(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const downloadCSV = (data, title) => {
    const arr = data;
    // eslint-disable-next-line no-unused-vars
    const newArr = arr.map(({ download_url, new_download_url, ...rest }) => {
      return rest;
    });
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: title,
      filename: title,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    if (newArr.length > 0) {
      csvExporter.generateCsv(newArr);
      setError("");
    } else {
      setError("Data not present");
    }
  };

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
                      {/* Render the content if user data exists */}
                      <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6 sm:px-6 lg:px-8 max-w-7xl p-3">
                        <div className="w-full mb-8">
                          <header className="w-full">
                            <h2 className="my-6 text-left text-3xl font-extrabold text-primary capitalize">
                              Document Reports
                            </h2>
                            <p className="my-6 text-left italic font-extrabold text-secondary capitalize">
                              Click the card to download its report
                            </p>
                          </header>
                        </div>

                        <div className="w-full mb-8">
                          <header className="w-full">
                            <h3 className="my-6 text-left text-2xl font-extrabold text-neutral capitalize">
                              Document Reports
                            </h3>
                          </header>
                          <div className="mb-8 w-full">
                            {/* Users */}
                            <div className="mb-5 mt-3">
                              <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 sm:gap-8">
                                <div className="stats shadow-md w-full sm:max-w-xs md:max-w-1/3 bg-base-100 text-neutral">
                                  <div
                                    className="stat cursor-pointer"
                                    onClick={(e) => {
                                      e && e.preventDefault;
                                      const title = "Total Documents";
                                      downloadCSV(docs, title);
                                    }}
                                  >
                                    <div className="stat-title">
                                      All Documents
                                    </div>
                                    <div className="stat-value mt-2 p-4">
                                      <button className="btn w-full btn-primary btn-outline">
                                        <BsDownload className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="stats shadow-md w-full sm:max-w-xs md:max-w-1/3 bg-base-100 text-neutral">
                                  <div
                                    className="stat cursor-pointer"
                                    onClick={(e) => {
                                      e && e.preventDefault;
                                      const title = `${user.first_name}'s Documents`;
                                      downloadCSV(docsMine, title);
                                    }}
                                  >
                                    <div className="stat-title">
                                      My Documents
                                    </div>
                                    <div className="stat-value mt-2 p-4">
                                      <button className="btn w-full btn-primary btn-outline">
                                        <BsDownload className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="stats shadow-md w-full sm:max-w-xs md:max-w-1/3 bg-base-100 text-neutral">
                                  <div
                                    className="stat cursor-pointer"
                                    onClick={(e) => {
                                      e && e.preventDefault;
                                      const title = `Documents shared with ${user.first_name}`;
                                      downloadCSV(docsShared, title);
                                    }}
                                  >
                                    <div className="stat-title">
                                      Shared Documents
                                    </div>
                                    <div className="stat-value mt-2 p-4">
                                      <button className="btn w-full btn-primary btn-outline">
                                        <BsDownload className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
                                Documents by category
                              </h3>
                              <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-8 mt-5">
                                {subcategories.map((subcategory) => (
                                  <div
                                    className="stats shadow-md w-full sm:max-w-xs md:max-w-1/3 bg-base-100 text-neutral"
                                    key={subcategory.subcategory_id}
                                  >
                                    <div
                                      className="stat cursor-pointer"
                                      onClick={(e) => {
                                        e && e.preventDefault;
                                        setSubCategory(
                                          subcategory.document_subcategory_name
                                        );
                                      }}
                                    >
                                      <div className="stat-title">
                                        {subcategory.document_subcategory_name}
                                      </div>
                                      <div className="stat-value mt-2 p-4">
                                        <button className="btn w-full btn-primary btn-outline">
                                          <BsDownload className="h-6 w-6" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <SideMenu /> {/* Render the SideMenu */}
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
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Prop Types
DocReports.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default DocReports;
