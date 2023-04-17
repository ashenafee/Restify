import './App.css';
import RestifyNavbar from "./components/Common/Navbar";
import SignupPage from "./components/Signup";

import PropertySearch from "./components/Search";
import { PropertyContextProvider } from "./context/PropertyContext";

import { PropertyCreateProvider } from './context/PropertyCreateContext';
import CreatePropertyForm from './components/Property/propertyCreate';

import PropertyDetail from './components/Property/propertyDetail';
import HomepageSearchBar from "./components/HomepageSearchBar";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import ReservationDetailList from './components/Reservation/reservationDetailList';
import PropertyReserve from './components/Property/propertyReserve';
import ReservationDetail from './components/Reservation/reservationDetail';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import LoginPage from './components/Login';

import UserProfilePage from './components/Profile';

import MyProperties from './components/HostPropertyList';

function App() {
    const { token } = useContext(AuthContext);
    const [authenticated, setAuthenticated] = useState(false);

    // doesn't work for me
    // useEffect(() => {
    //     if (localStorage.getItem('access_token') !== null) {
    //         setAuthenticated(true);
    //     } else {
    //         setAuthenticated(false);
    //     }
    // }, [token]);

    return (
        <BrowserRouter>
            <RestifyNavbar />
            <Routes>
                {/* Route to the homepage */}
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

                <Route
                    path="/property/:property_id/details"
                    element={<PropertyDetail/>}
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
                <Route
                    path="/catalog"
                    element={
                        <PropertyContextProvider>
                            <PropertySearch />
                        </PropertyContextProvider>
                    }
                />
                <Route
                    path="/reservation/:reservation_id/detail"
                    element={<ReservationDetail/>}
                />
                <Route
                    path="/reservation/details/list/"
                    element={<ReservationDetailList />}
                />
                <Route
                    path="/property/:property_id/reserve"
                    element={<PropertyReserve />}
                />

                <Route
                    path="/property/create"
                    element={<PropertyCreateProvider>
                        <CreatePropertyForm />
                    </PropertyCreateProvider>
                    }
                />

                <Route
                    path="/profile/edit"
                    element = {
                        <   UserProfilePage />
                    }
                />

                <Route
                    path="/profile/properties"
                    element = {
                        <   MyProperties />
                    }
                />
            </Routes>
            
        </BrowserRouter>
    );
}

export default App;