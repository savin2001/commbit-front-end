import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AiOutlineUpload } from "react-icons/ai";
import { FaFileUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { store } from "../firebase/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import useFetchBackendRoute from "../backend_connection/useFetchBackendRoute";
import axios from "axios";
//import { filesize } from "filesize";

const DocUpload = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [progress, setProgress] = useState(0);
  const backend = useFetchBackendRoute();

  const docUploadRoute = `${backend}/docs/upload`;
  const categoriesList = `${backend}/docs/categories`;

  useEffect(() => {
    fetchCategories();
    if (category) {
      const subCategoriesList = `${backend}/docs/subcategories/${category}`;
      const fetchSubCategories = async () => {
        try {
          const response = await axios.get(subCategoriesList);
          setSubCategories(response.data);
          console.log(response.data);
        } catch (error) {
          setError(error.response.data.message);
        }
      };
      fetchSubCategories();
    }
    if (!user) {
      // Handle the case when the user is not found
      setError({ message: "No user data found" });
    }
    setLoading(false);
  }, [user, category]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(categoriesList);
      setCategories(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    console.log(event.target.value);
  };

  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
    console.log(event.target.value);
  };

  const fileHandler = (e) => {
    e && e.preventDefault();
    // Grab the file
    console.log(e.target[0].files[0]);
    const file = e.target[0].files[0];

    // Check if a file has been selected
    if (!file) {
      setError("Please choose a file for upload");
      return;
    }
    // Check if the file format is allowed
    const allowedFormats = [
      "doc",
      "docx",
      "xls",
      "xlsx",
      "png",
      "jpg",
      "pdf",
      "txt",
      "csv",
      "pptx",
    ];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isFormatAllowed = allowedFormats.includes(fileExtension);

    // Check if the file size is within the limit
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    const isSizeValid = file.size <= maxSizeInBytes;

    if (isFormatAllowed && isSizeValid) {
      uploadFile(file);
    } else {
      // Handle invalid file format or size
      setError("Invalid file format or size");
    }
  };

  const uploadFile = (file) => {
    // If no file is selected then throw an error
    if (!file) {
      return setError("Kindly choose a file for upload");
    }
    // Continue if file is selected

    // Upload the file
    const subcategory_name = subCategory;
    const filename = file.name;
    const file_url = `/back_office_documents/${category}/${subCategory}/${file.name}`; // Replace with the appropriate value
    const file_size = file.size;
    // eslint-disable-next-line react/prop-types
    const email = user.email; // Replace with the appropriate value

    const documentData = {
      subcategory_name,
      filename,
      file_url,
      file_size,
      email,
    };
    // Create a directory URL where the file shall be stored
    const storageRef = ref(store, file_url);
    const uploadDoc = uploadBytesResumable(storageRef, file);
    const response = axios.post(docUploadRoute, documentData);
    console.log(response.data);
    uploadDoc.on(
      "state_changed",
      (snapshot) => {
        // Show upload progress
        const uploadProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(uploadProgress);
      },
      // In case of error during uploading
      (err) => {
        setError(err.message);
      }
    );
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex items-center justify-start py-8">
        <label
          htmlFor="doc-upload-modal-2"
          className="w-full flex justify-between items-center px-6 pt-5 pb-6 border-2 border-secondary border-dashed rounded-md cursor-pointer max-w-5xl"
        >
          <label className="block text-lg font-semibold text-neutral">
            Upload new document
          </label>
          <div className="flex flex-col items-center">
            <span className="inline-block sm:h-1/4 sm:w-1/3 md:h-1/3 md:w-1/6  overflow-hidden bg-secondary hover:shadow-xl">
              <label htmlFor="doc-upload-modal hover:cursor-pointer"></label>
            </span>
            <label className="mt-5 btn btn-outline btn-primary  animate-bounce">
              <AiOutlineUpload className="mx-auto justify-center h-6 w-6" />
            </label>
          </div>
        </label>
        <>
          <input
            type="checkbox"
            id="doc-upload-modal-2"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box md:w-1/2">
              <div>
                <label className="block text-xl font-semibold text-primary mb-4">
                  Document upload
                </label>
              </div>
              {loading ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                <>
                  <div className="form-control m-3 w-full">
                    <div className="input-group">
                      <select
                        className="select select-bordered"
                        required
                        value={category}
                        onChange={handleCategoryChange}
                        defaultValue={"Document category"}
                      >
                        <option disabled>Document category</option>
                        {categories && (
                          <>
                            {categories.map((category) => (
                              <option key={category.id} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="form-control m-3 w-full">
                    <div className="input-group">
                      <select
                        className="select select-bordered"
                        required
                        value={subCategory}
                        onChange={handleSubCategoryChange}
                        defaultValue={"Document sub-category"}
                      >
                        <option disabled>Document sub-category</option>
                        {subCategories && (
                          <>
                            {subCategories.map((subCategory) => (
                              <option
                                key={subCategory.id}
                                value={subCategory.name}
                              >
                                {subCategory.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="modal-action flex justify-between uppercase">
                    <label
                      htmlFor="doc-upload-modal-2"
                      className="btn btn-outline btn-error"
                      onClick={() => {
                        setErrorC(null);
                      }}
                    >
                      cancel
                    </label>
                    {category && subCategory && (
                      <label
                        htmlFor="doc-upload-modal"
                        className="btn btn-primary text-base-100"
                      >
                        next
                      </label>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
        <>
          <input
            type="checkbox"
            id="doc-upload-modal"
            className="modal-toggle"
          />

          <div className="modal">
            {progress ? (
              <>
                <div className="modal-box flex flex-col items-center justify-around">
                  <h3 className="block text-md font-semibold text-neutral mb-9">
                    File upload{progress === 100 ? "ed" : "ing"}
                  </h3>
                  <div className="flex justify-center items-center">
                    <div
                      className="radial-progress text-success h-32 w-32"
                      style={{ "--value": progress }}
                    >
                      {progress} %
                    </div>
                  </div>

                  {progress === 100 && (
                    <div className="modal-action  uppercase">
                      <Link to={`/${user.uid}/dashboard`}>
                        <label
                          htmlFor="doc-upload-modal"
                          className="btn btn-outline btn-error"
                        >
                          close
                        </label>
                      </Link>
                    </div>
                  )}
                  {error && (
                    <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center">
                      <label htmlFor="doc-upload-modal" className="mt-2">
                        {error}
                      </label>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <form className="modal-box md:w-1/2" onSubmit={fileHandler}>
                  <div>
                    <label className="block text-xl font-semibold text-primary mb-4">
                      Document upload
                    </label>

                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FaFileUpload className="mx-auto h-24 w-24  text-base-200 my-5" />

                        <p className="text-xs text-secondary">
                          DOC, DOCX, XLS, XLSX, PNG, JPG, TXT, CSV,PPTX and PDF
                          up to 10MB
                        </p>
                        <div className="flex text-sm text-gray-600 ">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-base-100 rounded-md font-medium text-primary hover:underline"
                          >
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="file:btn file:btn-sm file:btn-primary file:text-base-100"
                              onClick={() => {
                                setError(null);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-action flex justify-between uppercase">
                    <label
                      htmlFor="doc-upload-modal"
                      className="btn btn-outline btn-error"
                      onClick={() => {
                        setError(null);
                      }}
                    >
                      cancel
                    </label>
                    <button
                      type="submit"
                      className="btn btn-primary text-base-100"
                    >
                      upload file
                    </button>
                  </div>
                  {error && (
                    <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center">
                      <label htmlFor="doc-upload-modal" className="mt-2">
                        {error}
                      </label>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

// Prop Types
DocUpload.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default DocUpload;
