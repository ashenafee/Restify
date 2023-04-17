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


// not used
import HomepageSearchBar from "./components/HomepageSearchBar";

// React
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";


function App() {
    const { token } = useContext(AuthContext);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('access_token') !== null) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [token]);

    return (
        <BrowserRouter>
            <RestifyNavbar />
            <Routes>
                {/* Route to the homepage (search) */}
                <Route
                    path="/"
                    element={
                        authenticated
                            ?
                            <PropertyContextProvider>
                                <PropertySearch />
                            </PropertyContextProvider>
                            :
                            <Navigate to="/login" />
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

                {/* profile edit */}
                <Route
                    path="/profile/edit"
                    element = {
                        <   UserProfilePage />
                    }
                />
                {/* my properties */}
                <Route
                    path="/profile/properties"
                    element = {
                        <   MyProperties />
                    }
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
            </Routes>
            
        </BrowserRouter>
    );
}

export default App;