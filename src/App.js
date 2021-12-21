import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Home from "./screens/Home";

function App() {
  return (
    <div className="App h-screen ">
      <Router>
        <Routes>
          {console.log(process.env)}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
