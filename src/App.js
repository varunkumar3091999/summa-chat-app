import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setAuthenticated(true);
        setLoading(false);
        console.log(user);
      } else {
        setAuthenticated(false);
        setLoading(false);
        console.log(user);
      }
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
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
  );
}

export default App;
