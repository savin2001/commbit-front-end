import { useState } from "react";
import { auth, db } from "../../components/firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useAuthValue } from "../../components/firebase/AuthContext";
import {
  AiFillLock,
  AiFillEyeInvisible,
  AiOutlineEye,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import { MdPersonOutline } from "react-icons/md";

function Register() {
  const [fName, setFName] = useState("");
  const [sName, setSName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [visibility1, setVisibility1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setTimeActive } = useAuthValue();

  // Password visible
  const checkPassword = () => {
    setVisibility(true);
  };

  // Password hidden
  const hidePassword = () => {
    setVisibility(false);
  };

  // Password visible
  const checkConfirmedPassword = () => {
    setVisibility1(true);
  };

  // Password hidden
  const hideConfirmedPassword = () => {
    setVisibility1(false);
  };

  // Confirm is password is strong
  const getPasswordStrength = (password) => {
    const passwordLength = password.length;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);

    if (passwordLength === 0) {
      return ""; // No password provided
    } else if (
      passwordLength < 6 ||
      !(hasLowercase && hasUppercase && hasNumbers)
    ) {
      return "weak"; // Password is either less than 6 characters or missing a required character type
    } else if (passwordLength < 10) {
      return "medium"; // Password is between 6 and 9 characters and includes all required character types
    } else {
      return "strong"; // Password is 10 characters or more and includes all required character types
    }
  };

  // Confirm if passwords match
  const validatePassword = () => {
    let isValid = true;
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        isValid = false;
        setError("Passwords does not match");
      }
    }
    return isValid;
  };

  // Register user
  const register = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) {
      setLoading(false);
      setError("Error adding document!");
      return;
    }

    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userRef = collection(db, userType); // Collection based on userType

      await setDoc(
        doc(userRef, user.uid),
        {
          user_type: userType,
          email: email,
          first_name: fName,
          second_name: sName,
          phone_number: phone,
        },
        { merge: true }
      );

      await sendEmailVerification(user);
      setTimeActive(true);
      setLoading(false);
      navigate("/verify-email");
    } catch (err) {
      setLoading(false);
      setFName("");
      setSName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto ">
      <div className="min-h-full max-w-7xl flex items-center justify-center py-12 lg:px-8">
        <div className="mx-3 sm:w-full  md:max-w-md w-full space-y-8  mt-16">
          <div className="flex justify-center">
            <ul className="steps">
              <li className="step step-primary">Register</li>
              <li className="step">Verify account</li>
            </ul>
          </div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://api.dicebear.com/6.x/identicon/svg?seed=Ange"
            alt="avatar"
          />
          {loading ? (
            <div className="shadow-xl p-10 h-96 max-h-screen">
              <h3 className="mt-9 lg:text-2xl sm:text-xl text-primary pb-6 text-center">
                Almost there...
              </h3>

              <div className="flex justify-center items-center h-3/4">
                <FaSpinner className="h-1/4 w-1/4 text-primary animate-spin" />
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral">
                  Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-accent">
                  Or{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    you have an account
                  </Link>
                </p>
              </div>
              <div className="auth">
                <form
                  onSubmit={register}
                  className="mt-8 space-y-6"
                  name="registration_form"
                >
                  <div className=" md shadow-sm">
                    <div className="mb-9">
                      <div className="relative">
                        <label htmlFor="email-address" className="sr-only">
                          First name
                        </label>
                        <label className="cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 flex justify-center items-center">
                          <MdPersonOutline className="w-5 h-5 text-neutral" />
                        </label>
                        <input
                          id="first"
                          type="text"
                          value={fName}
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity("Fill in your name")
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          placeholder="First name"
                          className="input input-bordered input-neutral w-full focus:input-primary capitalize"
                          onChange={(e) => {
                            const input = e.target.value;
                            const sanitizedInput = input.replace(
                              /[^a-zA-Z\s]/g,
                              ""
                            );
                            setFName(sanitizedInput);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" md shadow-sm">
                    <div className="mb-9">
                      <div className="relative">
                        <label htmlFor="email-address" className="sr-only">
                          Second name
                        </label>
                        <label className="cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 flex justify-center items-center">
                          <MdPersonOutline className="w-5 h-5 text-neutral" />
                        </label>
                        <input
                          id="second"
                          type="text"
                          value={sName}
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity("Fill in your name")
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          placeholder="Second name"
                          className="input input-bordered input-neutral w-full focus:input-primary capitalize"
                          onChange={(e) => {
                            const input = e.target.value;
                            const sanitizedInput = input.replace(
                              /[^a-zA-Z\s]/g,
                              ""
                            );
                            setSName(sanitizedInput);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" md shadow-sm">
                    <div className="mb-9">
                      <div className="relative">
                        <label htmlFor="email-address" className="sr-only">
                          Phone number
                        </label>
                        <label className="cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 flex justify-center items-center">
                          <AiOutlinePhone className="w-5 h-5 text-neutral" />
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity(
                              "Fill in your phone number"
                            )
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          placeholder="Phone number"
                          className="input input-bordered input-neutral w-full focus:input-primary"
                          onChange={(e) => {
                            const input = e.target.value;
                            const sanitizedInput = input.replace(
                              /[^0-9+\-()\s]/g,
                              ""
                            );
                            setPhone(sanitizedInput);
                          }}
                        />
                      </div>
                    </div>
                  </div>
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

                  <div className=" md shadow-sm">
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
                          onInvalid={(e) => {
                            e.target.setCustomValidity(
                              "Enter a stronger password"
                            );
                            setPassword("");
                          }}
                          onInput={(e) => e.target.setCustomValidity("")}
                          className={`input input-bordered input-neutral w-full ${
                            password && getPasswordStrength(password) === "weak"
                              ? "focus:input-error border-red-500 text-red-500"
                              : password &&
                                getPasswordStrength(password) === "medium"
                              ? "focus:input-primary border-primary text-primary"
                              : password &&
                                getPasswordStrength(password) === "strong"
                              ? "focus:input-green-500 border-green-500 text-green-500"
                              : ""
                          }`}
                          placeholder="Enter your password"
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <label className="swap swap-rotate cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 z-50">
                          <input type="checkbox" aria-label="check password" />
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
                  <div className=" md shadow-sm">
                    <div className="mb-9">
                      <div className="relative">
                        <label htmlFor="confirm-password" className="sr-only">
                          Confirm password
                        </label>
                        <input
                          id="confirm-password"
                          name="password"
                          type={!visibility1 ? "password" : "text"}
                          value={confirmPassword}
                          required
                          onInvalid={(e) => {
                            e.target.setCustomValidity(
                              "Enter a stronger password"
                            );
                            setConfirmPassword("");
                          }}
                          onInput={(e) => e.target.setCustomValidity("")}
                          className={`input input-bordered input-neutral w-full ${
                            password &&
                            getPasswordStrength(confirmPassword) === "weak"
                              ? "focus:input-error border-red-500 text-red-500"
                              : password &&
                                getPasswordStrength(confirmPassword) ===
                                  "medium"
                              ? "focus:input-primary border-primary text-primary"
                              : password &&
                                getPasswordStrength(confirmPassword) ===
                                  "strong"
                              ? "focus:input-green-500 border-green-500 text-green-500"
                              : ""
                          }`}
                          placeholder="Confirm password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label className="swap swap-rotate cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 z-50">
                          <input type="checkbox" aria-label="check password" />
                          <div className="swap-on">
                            <AiFillEyeInvisible
                              className="w-5 h-5 text-neutral hover:text-primary"
                              onClick={checkConfirmedPassword}
                            />
                          </div>
                          <div className="swap-off">
                            <AiOutlineEye
                              className="w-5 h-5 text-neutral hover:text-primary"
                              onClick={hideConfirmedPassword}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className=" md shadow-sm">
                    <div className="mb-9">
                      <div className="relative">
                        <label htmlFor="select-role" className="sr-only">
                          Choose your role
                        </label>
                        <select
                          id="select-role"
                          value={userType}
                          required
                          onChange={(e) => setUserType(e.target.value)}
                          className="select select-bordered select-neutral w-full   focus:select-primary"
                        >
                          <option defaultValue value={""} disabled>
                            Select user type
                          </option>
                          <option value={"admin"}>Admin</option>
                          <option value={"content_manager"}>
                            Content Management
                          </option>
                          <option value={"event_manager"}>
                            Event Management
                          </option>
                          <option value={"back_office"}>Back Office</option>
                        </select>
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
                      Sign up
                    </button>
                  </div>
                </form>
                <div>
                  <Link
                    to="/"
                    className="group relative w-full flex justify-center p-3 text-sm font-medium mt-6 text-primary bg-base hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
