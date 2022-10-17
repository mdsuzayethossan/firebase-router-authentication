import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import app from "../../firebase/firebase.init";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
const auth = getAuth(app);
const SignUp = () => {
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState({});
  const [passwordErr, setPasswordErr] = useState("");
  const [cPasswordErr, setCpasswordErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [passwordTypeToggle, setPasswordTypeToggle] = useState(false);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const handleShowPassword = () => {
    setPasswordTypeToggle(!passwordTypeToggle);
  };
  const handleRegister = (event) => {
    setSuccess(false);
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const cpassword = form.cpassword.value;
    if (!name) {
      setNameErr("Name field is required");
      return;
    } else {
      setNameErr("");
    }

    if (!email) {
      setEmailErr("Email field is required");
      return;
    } else {
      setEmailErr("");
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailErr("You have entered an invalid email address!");
    } else {
      setEmailErr("");
    }
    if (!/(?=.*[!#$%&? "])/.test(password)) {
      setPasswordErr("Password must contain at least one Special Symbol.");
      return;
    } else {
      setPasswordErr("");
    }
    if (password.length < 8) {
      setPasswordErr("Password must be at least 8 characters");
      return;
    } else {
      setPasswordErr("");
    }
    if (!(cpassword === password)) {
      setCpasswordErr("Confirm password must be equal to password");
      return;
    } else {
      setNameErr("");
      setEmailErr("");
      setPasswordErr("");
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          verifyEmail();
          const user = result.user;
          console.log(user);
          updateuserName(name);
          form.reset();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage) {
            setEmailErr("This email already exist");
          }
        });
    }
  };
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      alert("Please check your email and verify");
    });
  };
  const updateuserName = (name) => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        setNameErr(error);
      });
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
        <h2 className="font-bold text-white text-2xl">SignUp Form</h2>
        <div className="mt-8">
          <form onSubmit={handleRegister} autoComplete="off">
            <div className="flex flex-col mb-2">
              {success && (
                <p className="bg-white text-green-500 mb-3 py-3 font-bold rounded-md">
                  User created successfully
                </p>
              )}
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <UserCircleIcon className="h-5 w-5 text-gray-500"></UserCircleIcon>
                </span>
                <input
                  type="text"
                  name="name"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your Name"
                />
              </div>
              <p className="text-yellow-300 text-left font-bold mt-2">
                {nameErr}
              </p>
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500"></EnvelopeIcon>
                </span>
                <input
                  type="text"
                  name="email"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your email"
                />
              </div>
              <p className="text-yellow-300 text-left font-bold mt-2">
                {emailErr}
              </p>
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <LockClosedIcon className="h-5 w-5 text-gray-500"></LockClosedIcon>
                </span>
                <input
                  type={`${passwordTypeToggle ? "text" : "password"}`}
                  name="password"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your password"
                />
                <span
                  onClick={handleShowPassword}
                  className="rounded-l-md inline-flex absolute  items-center px-3 right-2 top-0 bottom-0 text-gray-500 shadow-sm text-sm"
                >
                  {(passwordTypeToggle && (
                    <EyeIcon className="h-5 w-5 text-gray-500"></EyeIcon>
                  )) || (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500"></EyeSlashIcon>
                  )}
                </span>
              </div>

              <p className="text-yellow-300 text-left font-bold mt-2">
                {passwordErr}
              </p>
            </div>
            <div className="flex flex-col mb-6">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <LockClosedIcon className="h-5 w-5 text-gray-500"></LockClosedIcon>
                </span>
                <input
                  type="password"
                  name="cpassword"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Confirm password"
                />
              </div>
              <p className="text-yellow-300 text-left font-bold mt-2">
                {cPasswordErr}
              </p>
            </div>
            <div className="flex w-full">
              <button
                type="submit"
                className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-offset-2  rounded-lg "
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center mt-6 text-white">
          <span className="ml-2">
            Have an account?
            <Link to="/signin" className="font-bold ml-2">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
