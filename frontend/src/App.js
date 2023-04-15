import './App.css';
import RestifyNavbar from "./components/Common/Navbar";
import SignupPage from "./components/Signup";
import PropertyDetail from './components/Property/propertyDetail';
import HomepageSearchBar from "./components/HomepageSearchBar";
import {AuthProvider} from "./context/AuthContext";
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
            </Routes>
          </BrowserRouter>
  );
}

export default App;

