import { useState } from "react";
import { Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../components/firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../components/firebase/AuthContext";
import {
  AiFillLock,
  AiFillEyeInvisible,
  AiOutlineEye,
  AiOutlineMail,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import Loading from "../../components/data_fetch_state/Loading";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const userType = ["admin", "content_manager", "event_manager", "back_office"];
  const [error, setError] = useState("");
  const { setTimeActive } = useAuthValue();
  const navigate = useNavigate();

  // Password visible
  const checkPassword = () => {
    setVisibility(true);
  };

  // Password hidden
  const hidePassword = () => {
    setVisibility(false);
  };

  // Login user
  const login = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const userRefPromises = userType.map((type) =>
          getDoc(doc(db, type, auth.currentUser.uid))
        );
        const userSnapshots = await Promise.all(userRefPromises);
        const userSnapshot = userSnapshots.find((snapshot) => snapshot.exists());
  
        if (userSnapshot) {
          const user = userSnapshot.data();
          localStorage.setItem("upd", JSON.stringify(user)); // Store user data in local storage
        } else {
          throw new Error("User not found or invalid user type"); // Throw error if user not found or invalid user type
        }
      })
      .then(() => {
        if (!auth.currentUser.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              setTimeActive(true); // Set timeActive state to true
              navigate("/verify-email"); // Navigate to the "verify-email" page
            })
            .catch((err) => {
              setLoading(false); // Set loading state to false
              setEmail("");
              setPassword("");
              setError(err.message); // Set error state with the error message
            });
        } else {
          const storedUser = JSON.parse(localStorage.getItem("upd"));
          // console.log(storedUser);
          if (storedUser != null) {
            const dashboardPath = `/${storedUser.user_type}/dashboard`;
            navigate(dashboardPath); // Navigate to the user's dashboard based on user type
          } else {
            // console.log("No user data found");
          }
          // console.log("User verified");
          navigate("/"); // Navigate to the home page
        }
      })
      .catch((err) => {
        setLoading(false); // Set loading state to false
        setEmail("");
        setPassword("");
        console.log(err);
        if (err.message === "Firebase: Error (auth/network-request-failed).") {
          setError("Network error. Check your internet connection"); // Set error state for network error
        } else {
          setError(err.message); // Set error state with the error message
        }
      });
  };


  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container mx-auto">
            <div className="min-h-full max-w-7xl flex items-center justify-center py-12 lg:px-8">
              <div className="mx-3 sm:w-full  md:max-w-md w-full space-y-8  mt-16">
                <img
                  className="mx-auto h-12 w-auto"
                  src="https://api.dicebear.com/6.x/identicon/svg?seed=Ange"
                  alt="avatar"
                />
                <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral">
                    Sign in to your account
                  </h2>
                  <p className="mt-2 text-center text-sm text-accent">
                    Or{" "}
                    <Link
                      to="/register"
                      className="font-medium text-primary hover:underline"
                    >
                      you do not have an account
                    </Link>
                  </p>
                </div>
                <div className="auth">
                  <form
                    onSubmit={login}
                    className="mt-8 space-y-6"
                    name="login_form"
                  >
                    <div className=" md shadow-sm">
                      <div className="mb-9">
                        <div className="relative">
                          <label htmlFor="email-address" className="sr-only">
                            Email address
                          </label>
                          <label className="cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 flex justify-center items-center">
                            <AiOutlineMail className="w-5 h-5 text-neutral" />
                          </label>
                          <input
                            id="email-address"
                            type="email"
                            value={email}
                            autoComplete="email"
                            required
                            onInvalid={(e) =>
                              e.target.setCustomValidity("Enter a valid email")
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                            placeholder="Email address"
                            className="input input-bordered input-neutral w-full focus:input-primary"
                            onChange={(e) => {
                              const input = e.target.value;
                              const sanitizedInput = input.trim();
                              setEmail(sanitizedInput);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" md shadow-sm ">
                      <div className="mb-9">
                        <div className="relative">
                          <label htmlFor="password" className="sr-only">
                            Password
                          </label>
                          <input
                            id="password"
                            name="password"
                            type={!visibility ? "password" : "text"}
                            value={password}
                            required
                            onInvalid={(e) =>
                              e.target.setCustomValidity("Enter your password")
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                            className="input input-bordered input-neutral w-full   focus:input-primary"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label className="swap swap-rotate cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 z-50">
                            <input
                              type="checkbox"
                              aria-label="check password"
                            />
                            <div className="swap-on">
                              <AiFillEyeInvisible
                                className="w-5 h-5 text-neutral hover:text-primary"
                                onClick={checkPassword}
                              />
                            </div>
                            <div className="swap-off">
                              <AiOutlineEye
                                className="w-5 h-5 text-neutral hover:text-primary"
                                onClick={hidePassword}
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    {error && (
                      <div className=" text-sm uppercase p-4 text-base-100 bg-error text-center  3xl">
                        <p className="mt-2">{error}</p>
                      </div>
                    )}
                    <div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center p-3 border border-transparent text-sm font-medium text-base-100 bg-primary hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <AiFillLock
                            className="h-5 w-5 text-base group-hover:opacity-70"
                            aria-hidden="true"
                          />
                        </span>
                        Sign in
                      </button>
                    </div>
                  </form>
                  <div>
                    <Link
                      to="/"
                      className="mt-6 group relative w-full flex justify-center p-3 text-sm font-medium text-primary bg-base hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <AiOutlineArrowLeft
                          className="h-5 w-5 text-base group-hover:opacity-70"
                          aria-hidden="true"
                        />
                      </span>
                      Back to home page
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Login;
