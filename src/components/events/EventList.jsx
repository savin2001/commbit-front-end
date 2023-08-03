/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Loading from "../../components/data_fetch_state/Loading";
import SideMenu from "../../components/side_menu/SideMenu";
import PropTypes from "prop-types";
import Error from "../../components/data_fetch_state/Error";
import axios from "axios";
import useFetchBackendRoute from "../../components/backend_connection/useFetchBackendRoute";
import { AiOutlineMore } from "react-icons/ai";

const EventList = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [events, setEvents] = useState(null);
  const [event, setEvent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");

  const backend = useFetchBackendRoute();
  const eventsList = `${backend}/events/all`;
  const eventCancel = `${backend}/events/cancel/${event}`;

  useEffect(() => {
    fetchEvents();
    if (event) {
      console.log(event);
      const eventsDet = `${backend}/events/event/${event}`;
      const fetchEvent = async () => {
        try {
          const response = await axios.get(eventsDet);
          // setEvent(response.data);
          // console.log(response.data);
          if (response.data) {
            setTitle(response.data.title);
            setDescription(response.data.description);
            setLocation(response.data.location);
            setStartDate(dateFormatter(response.data.start_date));
            setEndDate(dateFormatter(response.data.end_date));
            setStartTime(timeFormatter(response.data.start_time));
            setEndTime(timeFormatter(response.data.description));
          }
        } catch (error) {
          setError(error.response.data.message);
        }
      };
      fetchEvent();
    }
    if (!user) {
      // Handle the case when the user is not found
      setError({ message: "No user data found" });
    }
    setLoading(false);
  }, [event]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(eventsList);
      setEvents(response.data);
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

  const timeFormatter = (inputTime) => {
    const time = inputTime;
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString(
      "en-US",
      options
    );

    return formattedTime;
  };

  const handleCancelEvent = async (e) => {
    e && e.preventDefault();
    if (event !== "") {
      console.log(event);
      try {
        const response = await axios.put(eventCancel);
        // setEvent(response.data);
        
        console.log(response.data);
      } catch (error) {
        setError(error.response.data.message);
      }
    }
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
                    {/* Events */}
                    <div className="mb-5 mt-3">
                      <h3 className="mt-8 text-left text-xl font-extrabold text-neutral">
                        Event List
                      </h3>
                      <div className="flex flex-wrap md:flex-nowrap w-full justify-center md:justify-start gap-4 sm:gap-8">
                        <div className="overflow-x-auto">
                          <table className="table w-full md:w-screen max-w-5xl">
                            {/* head */}
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Event</th>
                                <th>Location</th>
                                <th>Details</th>
                              </tr>
                            </thead>

                            <tbody>
                              {events && (
                                <>
                                  {events?.map((event) => (
                                    <tr
                                      className="hover cursor-pointer"
                                      key={event.id}
                                    >
                                      <th>{event.id}</th>
                                      <td>{event.title}</td>
                                      <td>{event.location}</td>
                                      {/* <td>{`${timeFormatter(
                                        event.start_time
                                      )} - ${timeFormatter(
                                        event.end_time
                                      )}`}</td> */}
                                      {event.del_flg == "N" ? (
                                        <td>
                                          <label
                                            htmlFor="event-list-modal-2"
                                            className="btn btn-outline btn-primary"
                                            onClick={(e) => {
                                              e && e.preventDefault;
                                              setEvent(event.id);
                                            }}
                                          >
                                            <AiOutlineMore className="mx-auto justify-center h-6 w-6" />
                                          </label>
                                        </td>
                                      ) : (
                                        <td>Finished</td>
                                      )}
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
                      id="event-list-modal-2"
                      className="modal-toggle"
                    />
                    <div className="modal">
                      <form
                        className="modal-box md:w-1/2"
                        onSubmit={handleCancelEvent}
                      >
                        <div className="flex flex-wrap">
                          <h3 className="sm:text-md md:text-2xl font-bold leading-6 text-primary mr-5 mb-6">
                            {title} details
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
                              readOnly
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
                              type="text"
                              id="start_date"
                              name="start_date"
                              value={start_date}
                              placeholder="Start Date"
                              className="input input-bordered input-neutral w-full focus:input-primary"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="end_date" className="sr-only">
                            End Date
                          </label>
                          <input
                            type="text"
                            readOnly
                            id="end_date"
                            name="end_date"
                            value={end_date}
                            className="input input-bordered input-neutral w-full focus:input-primary"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="start_time" className="sr-only">
                            Start Time
                          </label>
                          <input
                            type="text"
                            readOnly
                            id="start_time"
                            name="start_time"
                            value={start_time}
                            className="input input-bordered input-neutral w-full focus:input-primary"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="end_time" className="sr-only">
                            End Time
                          </label>
                          <input
                            type="text"
                            readOnly
                            id="end_time"
                            name="end_time"
                            value={end_time}
                            className="input input-bordered input-neutral w-full focus:input-primary"
                          />
                        </div>

                        <div className="modal-action flex justify-between uppercase">
                          <label
                            htmlFor="event-list-modal-2"
                            className="btn btn-outline btn-error"
                            onClick={() => {
                              setError(null);
                            }}
                          >
                            Close
                          </label>
                          <button
                            type="submit"
                            className="btn btn-primary text-base-100"
                          >
                            finish Event
                          </button>
                        </div>
                        {error && (
                          <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center">
                            <label
                              htmlFor="event-list-modal-2"
                              className="mt-2"
                            >
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

// Prop Types
EventList.propTypes = {
  user: PropTypes.shape({
    user_type: PropTypes.string.isRequired,
    // Other user properties
  }).isRequired,
};

export default EventList;
