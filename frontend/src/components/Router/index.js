import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignupForm from "../SignupForm";
import RestifyNavbar from "../Navbar";

// Kate's signup page
// import SignupPage from "../Signup";

function App() {
    const [authenticated, setAuthenticated] = useState(false);

    const handleSignup = () => {
        setAuthenticated(true);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/signup"
                    element={
                        authenticated ? (
                            <Navigate to="/" />
                        ) : (
                            <SignupForm />
                        )
                    }
                />
                <Route
                    path="/"
                    element={
                        authenticated ? <RestifyNavbar /> : <Navigate to="/signup" />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
