import './App.css';
import RestifyNavbar from "./components/Common/Navbar";
import SignupPage from "./components/Signup";
import PropertyDetail from './components/Property/propertyDetail';
import HomepageSearchBar from "./components/HomepageSearchBar";
import {AuthProvider} from "./context/AuthContext";
import ReservationDetail from './components/Reservation/reservationDetail'
import PropertyReserve from './components/Property/propertyReserve';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
          <BrowserRouter>
            <RestifyNavbar />
            <Routes>
                <Route path="/search" element={<HomepageSearchBar />}/>
                {/* <Route
                    path="/property/:property_id/details"
                    element={<PropertyDetail/>}
                />  */}
                <Route path="/signup" element={
                  <AuthProvider>
                    <SignupPage />
                  </AuthProvider>
                }/>
                />
                <Route 
                    path="/reservation/details/" 
                    element={<ReservationDetail />}
                />
                <Route
                    path="/property/:property_id/reserve"
                    element={<PropertyReserve />}
                />
            </Routes>
          </BrowserRouter>
  );
}

export default App;