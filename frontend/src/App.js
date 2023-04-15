import './App.css';
import RestifyNavbar from "./components/Navbar";
import HomepageSearchBar from "./components/HomepageSearchBar";
import PropertyDetail from './components/Property/propertyDetail';
import ReservationDetail from './components/Reservation/reservationDetail'
import PropertyReserve from './components/Property/propertyReserve';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
    return (
        <BrowserRouter>
            <RestifyNavbar />
            <Routes>
                <Route path="/search/" element={<HomepageSearchBar />}/>
                <Route
                    path="/property/:property_id/details"
                    element={<PropertyDetail/>}
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

        // for this we should create router later to be able to navigate between pages
        //       <AuthProvider>
        //         <SignupPage />
        //       </AuthProvider>
    );
}

export default App;