import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setAuthenticated(true);
        console.log(user);
      } else {
        setAuthenticated(false);
        console.log(user);
      }
    });
  }, []);

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
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
