import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
        console.log(user);
      }
    });
  }, []);

  const signOut = () => {
    getAuth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("signed out");
        navigate("/signin", { replace: true });
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <div className="h-12 bg-indigo-500 py-2 px-4 flex justify-between fixed w-screen z-10">
      <div>
        <p className="text-white text-2xl font-bold ">Summa</p>
      </div>
      <div className="flex">
        <p className="text-white text-xl">{user?.email}</p>
        {user ? (
          <button
            onClick={() => signOut()}
            className="bg-white text-indigo-500 mx-3 px-3"
          >
            Logout
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
