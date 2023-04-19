import './App.css';

// Navbar
import RestifyNavbar from "./components/Common/Navbar";

// Auth
import { AuthContext, AuthProvider } from "./context/AuthContext";
import SignupPage from "./components/Signup";
import LoginPage from './components/Login';

// Search
import { PropertyContextProvider } from "./context/PropertyContext";
import PropertySearch from "./components/Search";

// property details from user pov
import PropertyDetail from './components/Property/propertyDetail';
// reservation of the property from user pov
import PropertyReserve from './components/Property/propertyReserve';

// Profile sections

// edit profile page (Manage Profile)
import UserProfilePage from './components/Profile/updateProfile';

// see a list of reservations as a user or host
import ReservationDetailList from './components/Reservation/reservationDetailList';
// see a specific reservation as a user or host
import ReservationDetail from './components/Reservation/reservationDetail';

// list of existing properties
import MyProperties from './components/Profile/propertyList';
// create new property
import { PropertyCreateProvider } from './context/PropertyCreateContext';
import CreatePropertyForm from './components/Profile/propertyCreate';
// update property
import PropertyUpdate from './components/Profile/propertyManage';
// add photos to property
import PropertyImages from './components/Profile/propertyImages';
// add availability to property
import PropertyAvailability from './components/Profile/propertyAvailability';


// not used
import HomepageSearchBar from "./components/HomepageSearchBar";

// React
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import ManageProfile from "./components/ManageProfile";
import Reviews from "./components/Reviews";


function App() {
    const { token } = useContext(AuthContext);
    const [authenticated, setAuthenticated] = useState(false);

    // Create an async function to check if the refresh token is valid
    const checkToken = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken !== null) {
            const response = await fetch("http://localhost:8000/api/token/refresh/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: refreshToken,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("access_token", data.access);
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("access_token");
            }
        } else {
            setAuthenticated(false);
        }
    };

    // Check the token on page load
    useEffect(() => {
        checkToken().then(() => {
            console.log("Token checked");
        });
        // Respond to the "loggedOut" message
        window.addEventListener("loggingOut", () => {
            console.log("App.js: Logged out");

            // Update the authentication status
            setAuthenticated(false);

            // Send a message to the login page
            window.dispatchEvent(new Event("loggedOut"));
        });
    });

    return (
        <BrowserRouter>
            <RestifyNavbar />
            <Routes>
                {/* Route to the homepage (search) */}
                <Route
                    path="/"
                    element={
                        <MainContent
                            authenticated={authenticated}
                            setAuthenticated={setAuthenticated}
                        />
                    }
                />

                {/* Route to the login page */}
                <Route
                    path="/login"
                    element={
                        authenticated ? (
                            <Navigate to="/" />
                        ) : (
                            <AuthProvider>
                                <LoginPage setAuthenticated={setAuthenticated} />
                            </AuthProvider>
                        )
                    }
                />

                {/* Temporary signup */}
                <Route
                    path="/signup"
                    element={
                        authenticated ? (
                                <Navigate to="/" />

                        ) : (
                            <AuthProvider>
                                <SignupPage />
                            </AuthProvider>
                        )
                    }
                />

                {/* Ash's sign up that doesn't work for me */}
                <Route
                    path="/signup"
                    element={
                        token ? (
                            <Navigate to="/" />

                        ) : (
                            <AuthProvider>
                                <SignupPage />
                            </AuthProvider>
                        )
                    }
                />

                {/* catalog */}
                <Route
                    path="/catalog"
                    element={
                        <PropertyContextProvider>
                            <PropertySearch />
                        </PropertyContextProvider>
                    }
                />
                {/* property details */}
                <Route
                    path="/property/:property_id/details"
                    element={<PropertyDetail/>}
                />
                {/* make reservation */}
                <Route
                    path="/property/:property_id/reserve"
                    element={<PropertyReserve />}
                />

                {/* my reservations */}
                <Route
                    path="/reservation/details/list/"
                    element={<ReservationDetailList />}
                />
                <Route
                    path="/reservation/:reservation_id/detail"
                    element={<ReservationDetail/>}
                />

                {/* Profile Routes */}
                <Route
                    path="/profile/*"
                    element={<ProfileRoutes />}
                />
                {/* property create */}
                <Route
                    path="/property/create"
                    element={<PropertyCreateProvider>
                        <CreatePropertyForm />
                    </PropertyCreateProvider>
                    }
                />
                {/* property update */}
                <Route
                    path="/property/:property_id/update"
                    element={
                        <PropertyUpdate />
                    }
                />
                {/* property add images */}
                <Route
                    path="/property/:property_id/images"
                    element={
                        <PropertyImages />
                    }
                />
                {/* set property availability */}
                <Route
                    path="/property/:property_id/availability"
                    element={
                        <PropertyAvailability />
                    }
                />
            </Routes>

        </BrowserRouter>
    );
}

function MainContent({ authenticated, setAuthenticated }) {
    if (authenticated) {
        return (
            <PropertyContextProvider>
                <PropertySearch />
            </PropertyContextProvider>
        );
    } else {
        return <Navigate to="/login" />;
    }
}

function ProfileRoutes() {
    return (
        <Routes>
            {/* Manage */}
            <Route path="/" element={<ManageProfile />} />

            {/* Edit */}
            <Route path="/edit" element={<UserProfilePage />} />

            {/* Reservations */}
            <Route path="/reservations" element={<ReservationDetailList />} />

            {/* Properties */}
            <Route path="/properties" element={<MyProperties />} />

            {/* Reviews */}
            <Route path="/reviews" element={<Reviews />} />
        </Routes>
    );
}

export default App;