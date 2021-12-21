import { useState } from "react";

import * as auth from "firebase/auth";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignInWithEmail = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(auth.getAuth(), email, password)
      .then((userCredential) => {
        // Signed in
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="">
      <Header />
      <div className="h-screen flex items-center justify-center">
        <div className="shadow-xl h-1/2 w-1/3 rounded">
          <div className="shadow-xl h-10 bg-indigo-500 rounded py-2 text-white text-left px-2">
            Sign In
          </div>
          <div className="px-5 w-3/4 mx-auto my-10">
            <form
              onSubmit={(e) => {
                handleSignInWithEmail(e);
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
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
