import { useState } from "react";
import PropTypes from "prop-types";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useFetchBackendRoute from "../backend_connection/useFetchBackendRoute";

import axios from "axios";
//import { filesize } from "filesize";

const EventCreation = ({ user }) => {
  const [error, setError] = useState(null);
  const category_id = 9;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const backend = useFetchBackendRoute();
  const navigate = useNavigate();
  const docUploadRoute = `${backend}/events/new`;

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line react/prop-types
    const organizer_email = user.email;

    try {
      const eventData = {
        category_id,
        title,
        description,
        location,
        start_date,
        end_date,
        start_time,
        end_time,
        organizer_email,
      };

      console.log(eventData)
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
          <div className="modal">
            <form className="modal-box md:w-1/2" onSubmit={handleCreateEvent}>
              <div className="flex flex-wrap">
                <h3 className="sm:text-md md:text-2xl font-bold leading-6 text-primary mr-5 mb-6">
                  Event details
                </h3>
              </div>
              <div className="mb-3">
                <div className="col-span-6 md:col-span-3 relative">
                  <label htmlFor="title" className="sr-only">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    placeholder="Event name"
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered input-neutral w-full focus:input-primary capitalize"
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="col-span-6 md:col-span-3 relative">
                  <label htmlFor="description" className="sr-only">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input input-bordered input-neutral w-full focus:input-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="col-span-6 md:col-span-3 relative">
                  <label htmlFor="location" className="sr-only">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input input-bordered input-neutral w-full focus:input-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="col-span-6 md:col-span-3 relative">
                  <label htmlFor="start_date" className="sr-only">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={start_date}
                    placeholder="Start Date"
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input input-bordered input-neutral w-full focus:input-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="end_date" className="sr-only">
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={end_date}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input input-bordered input-neutral w-full focus:input-primary"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="start_time" className="sr-only">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={start_time}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input input-bordered input-neutral w-full focus:input-primary"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="end_time" className="sr-only">
                  End Time
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={end_time}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input input-bordered input-neutral w-full focus:input-primary"
                />
              </div>

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
                  Create Event
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
EventCreation.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default EventCreation;
