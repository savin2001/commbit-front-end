import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchBackendRoute from "../backend_connection/useFetchBackendRoute";
import SideMenu from "../side_menu/SideMenu";
import Error from "../data_fetch_state/Error";
import { AiOutlineMore } from "react-icons/ai";
import Loading from "../data_fetch_state/Loading";
import axios from "axios";

const ContentList = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [blog, setBlog] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const backend = useFetchBackendRoute();
  const navigate = useNavigate();
  const contentListRoute = `${backend}/cms/content/all`;

  useEffect(() => {
    fetchBlogs();
    if (blog) {
      console.log(blog);
      const blogsDet = `${backend}/cms/content/${blog}`;
      const fetchBlog = async () => {
        try {
          const response = await axios.get(blogsDet);
          // setBlog(response.data);
          // console.log(response.data);
          if (response.data) {
            setTitle(response.data.title);
            setContent(response.data.content);
            setPublishDate(dateFormatter(response.data.published_at));
          }
        } catch (error) {
          setError(error.response.data.message);
        }
      };
      fetchBlog();
    }
    if (!user) {
      // Handle the case when the user is not found
      setError({ message: "No user data found" });
    }
    setLoading(false);
  }, [blog]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(contentListRoute);
      setBlogs(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const dateFormatter = (inputDte) => {
    const date = new Date(inputDte);
    const options = { day: "2-digit", month: "short", year: "2-digit" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
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
                    {/* Blogs */}
                    <div className="mb-5 mt-3">
                      <h3 className="mt-8 text-left text-xl font-extrabold text-neutral">
                        Blog List
                      </h3>
                      <div className="flex flex-wrap md:flex-nowrap w-full justify-center md:justify-start gap-4 sm:gap-8">
                        <div className="overflow-x-auto">
                          <table className="table w-full md:w-screen max-w-5xl">
                            {/* head */}
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Blog</th>
                                <th>Published</th>
                                <th>Preview</th>
                              </tr>
                            </thead>

                            <tbody>
                              {blogs && (
                                <>
                                  {blogs?.map((blog) => (
                                    <tr
                                      className="hover cursor-pointer"
                                      key={blog.id}
                                    >
                                      <th>{blog.id}</th>
                                      <td>{blog.title}</td>
                                      <td>{`${dateFormatter(
                                        blog.published_at
                                      )}`}</td>

                                      <td>
                                        <label
                                          htmlFor="blog-list-modal-2"
                                          className="btn btn-outline btn-primary"
                                          onClick={(e) => {
                                            e && e.preventDefault;
                                            setBlog(blog.id);
                                          }}
                                        >
                                          <AiOutlineMore className="mx-auto justify-center h-6 w-6" />
                                        </label>
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
                  <>
                    <input
                      type="checkbox"
                      id="blog-list-modal-2"
                      className="modal-toggle"
                    />
                    <div className="modal w-screen z-50">
                      <form className="modal-box max-w-screen-lg">
                        <label
                          htmlFor="blog-list-modal-2"
                          className="btn btn-sm btn-outline btn-circle btn-error absolute right-2 top-2"
                          onClick={() => {
                            setError(null);
                          }}
                        >
                          ✕
                        </label>
                        <div className="flex flex-wrap">
                          <h3 className="sm:text-md md:text-2xl font-bold leading-6 text-primary mr-5 mb-6">
                            {title}
                          </h3>
                        </div>

                        <div
                          style={{
                            marginTop: "20px",
                            border: "1px solid #ccc",
                            padding: "10px",
                          }}
                          dangerouslySetInnerHTML={{ __html: content }}
                        ></div>
                        <div className="modal-action flex justify-between uppercase">
                          <label
                            htmlFor="blog-list-modal-2"
                            className="btn btn-outline btn-error"
                            onClick={() => {
                              setError(null);
                            }}
                          >
                            close
                          </label>
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

export default ContentList;
