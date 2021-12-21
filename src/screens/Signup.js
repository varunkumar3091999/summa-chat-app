import { useState } from "react";
import { v4 as uuid } from "uuid";
import * as auth from "firebase/auth";
import { doc, setDoc, getFirestore, collection } from "firebase/firestore";

import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import app from "../base";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const db = getFirestore(app);

  const navigate = useNavigate();

  const handleSignUpWithEmail = (e) => {
    e.preventDefault();

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
          .then((res) => navigate("/", { replace: true }))
          .catch((err) => console.log(err, "error"));

        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        // ..
      });
  };

  return (
    <div className="">
      {/* <Header /> */}
      <div className="h-screen flex items-center justify-center">
        <div className="shadow-xl h-1/2 w-1/3 rounded">
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
              <div className="mt-9">
                <button
                  type="submit"
                  className="bg-indigo-500 px-3 py-2 rounded text-white font-semibold"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;