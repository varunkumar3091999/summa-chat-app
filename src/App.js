import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CurrentUserContext from "./context/currentUserContext";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setCurrentUser(user);
        setAuthenticated(true);
        setLoading(false);
      } else {
        setCurrentUser(user);
        setAuthenticated(false);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App h-screen ">
        {authenticated ? (
          <Router>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        ) : (
          <Router>
            <Routes>
              <Route path="*" element={<Signin />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        )}
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
