import { useAuthValue } from "../firebase/AuthContext";
import Navbar from "../navbars/Navbar";
import SideMenu from "../side_menu/SideMenu";
import { auth, db } from "../firebase/firebase";
import { doc, collection, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { signOut, updateEmail } from "firebase/auth";
import Loading from "../data_fetch_state/Loading";

function Profile() {
  // Get the current user from the authentication context
  const { currentUser } = useAuthValue();
  const [fName, setFName] = useState("");
  const [sName, setSName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const userRole = ["admin", "content_manager", "event_manager", "back_office"];
  const userRoleDesc = [
    "Admin",
    "Content Manager",
    "Event Manager",
    "Back Office",
  ];
  const [userType, setUserType] = useState("");
  let userTypeDesc = null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let userCollection = [];

  useEffect(() => {
    // Fetch user data from local storage when the currentUser changes
    if (currentUser) {
      let user = JSON.parse(localStorage.getItem("upd"));
      setEmail(user.email);
      setFName(user.first_name);
      setPhone(user.phone_number);
      setSName(user.second_name);
      setUserType(user.user_type);
    } else {
      // Set error if no user is found
      setError("No user found!");
    }
  }, [currentUser]);

  if (userType != "") {
    // Match user type with role and description and add to userCollection array
    if (userRole.includes(userType)) {
      const roleIndex = userRole.indexOf(userType);
      const role = userRole[roleIndex];
      const description = userRoleDesc[roleIndex];
      userCollection.push({ role, description });
    }
    // Assign the description of the user type
    userTypeDesc = userCollection[0].description;
    // console.log(userTypeDesc);
  }

  const update = (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setLoading(true); // Set loading state to true
    updateEmail(auth.currentUser, email)
      .then(async () => {
        // Get the collection reference based on user role
        const colRef = collection(db, userCollection[0].role);
        // Get the user document reference
        const userRef = doc(colRef, auth.currentUser.uid);
        // Update the user document with the new data
        await setDoc(userRef, {
          user_type: userType,
          email: email,
          first_name: fName,
          second_name: sName,
          phone_number: phone,
        });
      })
      .then(() => {
        setLoading(true);
        signOut(auth);// Sign out the user
        // console.log("name changed");
      })
      .catch((err) => {
        setLoading(false);
        // console.log(err);
        setError(err.message); // Set error state with the error message
      });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <div className="w-full">
            <div className="mx-auto">
              <div className="drawer drawer-mobile">
                <input
                  id="my-drawer-2"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col items-start justify-start mt-16">
                  <div className="p-4">
                    <div>
                      <div className="shadow-lg overflow-hidden sm:rounded-lg pb-4 mb-8 bg-base-100 ">
                        <div className="px-4 py-5 bg-base-100 space-y-6 sm:p-6">
                          <div className="flex flex-wrap">
                            <h3 className="sm:text-md md:text-lg font-bold leading-6 text-primary mr-5">
                              Personal Information
                            </h3>
                            <p className="mt-1 text-sm text-neutral italic">
                              (Use a correct details such as phone numbers and
                              email where you can receive official
                              communication)
                            </p>
                          </div>
                          <div className="py-3">
                            <div className="border-t border-secondary" />
                          </div>
                          <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-6 md:col-span-3 relative">
                              <label htmlFor="first_name" className="sr-only">
                                First name
                              </label>
                              <input
                                type="text"
                                id="first_name"
                                name="firstName"
                                value={fName}
                                disabled
                                placeholder="First name"
                                onChange={(e) => setFName(e.target.value)}
                                className="input input-bordered input-neutral w-full focus:input-primary capitalize"
                              />
                            </div>

                            <div className="col-span-6 md:col-span-3 relative">
                              <label htmlFor="second_name" className="sr-only">
                                Second name
                              </label>
                              <input
                                type="text"
                                id="second_name"
                                name="lastName"
                                value={sName}
                                disabled
                                placeholder="Last name"
                                onChange={(e) => setSName(e.target.value)}
                                className="input input-bordered input-neutral w-full focus:input-primary capitalize"
                              />
                            </div>

                            <div className="col-span-6 md:col-span-3 relative">
                              <label
                                htmlFor="email-address"
                                className="sr-only"
                              >
                                Email address
                              </label>
                              <input
                                type="text"
                                id="email-address"
                                name="email"
                                placeholder="Email address"
                                value={email}
                                disabled
                                onChange={(e) => setEmail(e.target.value)}
                                className="input input-bordered input-neutral w-full focus:input-primary"
                              />
                            </div>
                            <div className="col-span-6 md:col-span-3 relative">
                              <label htmlFor="phone" className="sr-only">
                                Phone number
                              </label>
                              <input
                                type="text"
                                id="phone"
                                name="contact"
                                value={phone}
                                disabled
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone number"
                                className="input input-bordered input-neutral w-full focus:input-primary"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex w-full justify-center">
                          <label
                            htmlFor="profile-details-modal"
                            className="mt-5 btn btn-outline sm:btn-sm md:btn-md btn-primary "
                          >
                            Change
                          </label>
                        </div>

                        <>
                          <input
                            type="checkbox"
                            id="profile-details-modal"
                            className="modal-toggle"
                          />
                          <div className="modal">
                            <form onSubmit={update} className="modal-box w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
                              <div className="flex flex-wrap mb-5">
                                <h3 className="sm:text-md md:text-lg font-bold leading-6 text-primary mr-5 capitalize">
                                  Change personal details
                                </h3>
                                <p className="mt-1 text-sm italic text-error animate-pulse">
                                  (You will be logged out due to the sensitivity
                                  of the details changed)
                                </p>
                              </div>

                              <div className="details">
                                <div className="grid grid-cols-3 gap-8">
                                  <div className="col-span-3 relative">
                                    <label
                                      htmlFor="email-address"
                                      className="sr-only"
                                    >
                                      Email address
                                    </label>
                                    <input
                                      type="text"
                                      id="email-address"
                                      name="email"
                                      autoComplete="given-name"
                                      placeholder="Email address"
                                      value={email}
                                      disabled
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="input input-bordered input-neutral w-full focus:input-primary"
                                    />
                                  </div>
                                  <div className="col-span-6 md:col-span-3 relative">
                                    <label
                                      htmlFor="first_name"
                                      className="sr-only"
                                    >
                                      First name
                                    </label>
                                    <input
                                      type="text"
                                      id="first_name"
                                      name="firstName"
                                      autoComplete="given-name"
                                      value={fName}
                                      placeholder="First name"
                                      onChange={(e) => setFName(e.target.value)}
                                      className="input input-bordered input-neutral w-full focus:input-primary capitalize"
                                    />
                                  </div>

                                  <div className="col-span-6 md:col-span-3 relative">
                                    <label
                                      htmlFor="second_name"
                                      className="sr-only"
                                    >
                                      Second name
                                    </label>
                                    <input
                                      type="text"
                                      id="second_name"
                                      name="lastName"
                                      autoComplete="given-name"
                                      value={sName}
                                      placeholder="Second name"
                                      onChange={(e) => setSName(e.target.value)}
                                      className="input input-bordered input-neutral w-full focus:input-primary capitalize"
                                    />
                                  </div>

                                  <div className="col-span-6 md:col-span-3 relative">
                                    <label htmlFor="phone" className="sr-only">
                                      User type
                                    </label>
                                    {/* userTypeDesc */}
                                    <select
                                      id="select-role"
                                      value={userType}
                                      required
                                      onChange={(e) =>
                                        setUserType(e.target.value)
                                      }
                                      className="select select-bordered select-neutral w-full"
                                      disabled
                                    >
                                      <option defaultValue disabled>
                                        {userTypeDesc && userTypeDesc}
                                      </option>
                                    </select>
                                  </div>
                                  <div className="col-span-6 md:col-span-3 relative">
                                    <label htmlFor="phone" className="sr-only">
                                      Phone number
                                    </label>
                                    <input
                                      type="text"
                                      id="phone"
                                      name="contact"
                                      value={phone}
                                      onChange={(e) => setPhone(e.target.value)}
                                      placeholder="Phone number"
                                      className="input input-bordered input-neutral w-full focus:input-primary"
                                    />
                                  </div>
                                  {error && (
                                    <div className="text-sm col-span-6 uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
                                      <p className="mt-2">{error}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="modal-action flex justify-between uppercase">
                                <label
                                  htmlFor="profile-details-modal"
                                  className="btn sm:btn-sm md:btn-md btn-outline btn-error "
                                >
                                  cancel
                                </label>
                                <label htmlFor="profile-details-modal">
                                  <button
                                    type="submit"
                                    className="btn sm:btn-sm md:btn-md btn-success text-base-100 flex "
                                  >
                                    update details
                                  </button>
                                </label>
                              </div>
                            </form>
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </div>
                <SideMenu />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Profile;
