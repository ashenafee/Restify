import './App.css';
import RestifyNavbar from "./components/Common/Navbar";
import SignupPage from "./components/Signup";

import PropertySearch from "./components/Search";
import { PropertyContextProvider } from "./context/PropertyContext";

import PropertyDetail from './components/Property/propertyDetail';
import HomepageSearchBar from "./components/HomepageSearchBar";
import {AuthProvider} from "./context/AuthContext";
import ReservationDetailList from './components/Reservation/reservationDetailList'
import PropertyReserve from './components/Property/propertyReserve';
import ReservationDetail from './components/Reservation/reservationDetail';

import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {useState} from "react";
import LoginPage from './components/Login';

import CreatePropertyForm from './components/Property/propertyCreate'; 

import { PropertyCreateProvider } from "./context/PropertyCreateContext";


function App() {

const [authenticated, setAuthenticated] = useState(false);

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
                {/* Route to the property details page */}
                <Route
                    path="/property/:property_id/details"
                    element={<PropertyDetail/>}
                /> 
                {/* Route to the signup page */}
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
                {/* Route to the catalog page */}
                <Route
                    path="/catalog"
                    element={
                      <PropertyContextProvider>
                      <PropertySearch />
                    </PropertyContextProvider>
                    }
                />

                {/* Route to the reservation details page */}
                <Route
                    path="/reservation/:reservation_id/detail"
                    element={<ReservationDetail/>}
                />
                <Route 
                    path="/reservation/details/list/" 
                    element={<ReservationDetailList />}
                />
                {/* Route to the property reserve page */}
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
            </Routes>
          </BrowserRouter>
  );
}

export default App;