import { useState } from "react";
import PropTypes from "prop-types";
import useFetchBackendRoute from "../backend_connection/useFetchBackendRoute";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

const ContentCreation = ({ user }) => {
  const [error, setError] = useState(null);
  const category_id = 9;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const backend = useFetchBackendRoute();
  const navigate = useNavigate();
  const docUploadRoute = `${backend}/cms/content/new`;

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line react/prop-types
    const author_email = user.email;

    try {
      const eventData = {
        category_id,
        title,
        content,
        author_email,
      };

      console.log(eventData);
      const response = await axios.post(docUploadRoute, eventData);
      console.log(response.data);
      navigate("/");
      // Handle successful response
    } catch (error) {
      setError(error.response.data.message);
      // Handle error response
    }
  };
  return (
    <div className="w-full mx-auto">
      <div className="w-full flex items-center justify-start py-8">
        <label
          htmlFor="event-list-modal"
          className="w-full flex justify-between items-center px-6 pt-5 pb-6 border-2 border-secondary border-dashed rounded-md cursor-pointer max-w-5xl"
        >
          <label className="block text-lg font-semibold text-neutral">
            Create new event
          </label>
          <div className="flex flex-col items-center">
            <span className="inline-block sm:h-1/4 sm:w-1/3 md:h-1/3 md:w-1/6  overflow-hidden bg-secondary hover:shadow-xl">
              <label htmlFor="event-list-modal"></label>
            </span>
            <label className="mt-5 btn btn-outline btn-primary  animate-bounce">
              <AiOutlinePlus className="mx-auto justify-center h-6 w-6" />
            </label>
          </div>
        </label>
        <>
          <input
            type="checkbox"
            id="event-list-modal"
            className="modal-toggle"
          />
          <div className="modal w-screen z-50">
            <form
              className="modal-box max-w-screen-lg"
              onSubmit={handleCreateBlog}
            >
              <div className="flex flex-wrap">
                <h3 className="sm:text-md md:text-2xl font-bold leading-6 text-primary mr-5 mb-6">
                  Blog details
                </h3>
              </div>
              <div className="mb-3">
                <div className="col-span-6 md:col-span-3 relative">
                  <label htmlFor="title" className="sr-only">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    placeholder="Blog Title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered input-neutral w-full focus:input-primary capitalize"
                  />
                </div>
              </div>
              <Editor
                apiKey="ms8ap9rqoj003vp0ifcewfzeeng5eng6wbgmf5banit7ovx8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
              <div className="modal-action flex justify-between uppercase">
                <label
                  htmlFor="event-list-modal"
                  className="btn btn-outline btn-error"
                  onClick={() => {
                    setError(null);
                  }}
                >
                  Cancel
                </label>
                <button type="submit" className="btn btn-primary text-base-100">
                  Create Blog
                </button>
              </div>
              {error && (
                <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center">
                  <label htmlFor="event-list-modal" className="mt-2">
                    {error}
                  </label>
                </div>
              )}
            </form>
          </div>
        </>
      </div>
    </div>
  );
};

// Prop Types
ContentCreation.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default ContentCreation;
