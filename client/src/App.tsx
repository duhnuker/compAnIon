import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import YourProgress from "./pages/YourProgress";
import Resources from "./pages/Resources";
import YourEntries from "./pages/YourEntries";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean: boolean) => {
    setIsAuthenticated(boolean);
  };

  const checkAuthenticated = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            jwt_token: localStorage.token
          }
        }
      );

      const parseRes = response.data;

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />} />
        <Route path="/journalentries" element={isAuthenticated ? <YourEntries /> : <Navigate to="/login" />} />
        <Route path="/yourprogress" element={isAuthenticated ? <YourProgress /> : <Navigate to="/login" />} />
        <Route path="/resources" element={isAuthenticated ? <Resources /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
