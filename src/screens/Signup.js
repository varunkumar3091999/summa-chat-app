import { useState } from "react";
import { v4 as uuid } from "uuid";
import * as auth from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import app from "../base";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const db = getFirestore(app);

  const navigate = useNavigate();

  const handleSignUpWithEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    auth
      .createUserWithEmailAndPassword(auth.getAuth(), email, password)
      .then(async (userCredential) => {
        // Signed in

        var user = userCredential.user;
        const uid = uuid();
        console.log(user);

        console.log();

        console.log(user.email, uid);
        await setDoc(doc(db, "users", uid), {
          email: user.email,
          authId: user.uid,
        })
          .then(() => navigate("/", { replace: true }))
          .catch((err) => console.log(err, "error"));

        // ...
      })
      .catch((error) => {
        console.log(error);
        // ..
      });
  };

  return (
    <div className="">
      <Header />
      <div className="h-screen flex items-center justify-center">
        <div className="shadow-xl h-4/12 w-1/3 rounded">
          <div className="shadow-xl h-10 bg-indigo-500 rounded py-2 text-white text-left px-2">
            Sign Up
          </div>
          <div className="px-5 w-3/4 mx-auto my-10">
            <form
              onSubmit={(e) => {
                handleSignUpWithEmail(e);
                console.log("here");
              }}
              autoComplete="off"
            >
              <div>
                <p className="text-3xl font-bold text-gray-500">Welcome!</p>
                {/* <p className="text-xl font- text-gray-400">Create Account</p> */}
              </div>
              <div className="flex flex-col items-center  mt-7">
                <input
                  className="border w-full h-10 rounded px-2"
                  placeholder="Enter your email address!"
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>

              <div className="flex flex-col items-center">
                <input
                  className="border w-full h-10 rounded mt-7 px-2"
                  placeholder="Enter your password!"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </div>

              <div className="flex flex-col items-center">
                <input
                  className="border w-full h-10 rounded mt-7 px-2"
                  placeholder="Confirm your password!"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                />

                {confirmPassword.length > 0 ? (
                  password === confirmPassword ? null : (
                    <p className="self-start text-red-500 absolute">
                      Should match password.
                    </p>
                  )
                ) : null}
              </div>
              <div className="mt-9 justify-center">
                <button
                  type="submit"
                  className=" w-1/3 bg-indigo-500 px-3 py-2 rounded text-white font-semibold"
                >
                  {loading ? (
                    <div className="justify-center mx-auto h-5 w-5 border-2 border-white border-r-indigo-500 rounded-full animate-spin"></div>
                  ) : (
                    <p className="mx-auto">Sign Up</p>
                  )}
                </button>
                <p>or</p>
                <Link to={"/signin"} className="underline text-indigo-500">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
