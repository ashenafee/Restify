import './App.css';
import RestifyNavbar from "./components/Navbar";
import HomepageSearchBar from "./components/HomepageSearchBar";
import PropertyDetail from './components/Property/propertyDetail';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


function App() {
    return (
        <BrowserRouter>
            <RestifyNavbar />
            <HomepageSearchBar />

            <Switch>
                <Route path="/property/:id/details" component={PropertyDetail} />
            </Switch>
        </BrowserRouter>

        // for this we should create router later to be able to navigate between pages
        //       <AuthProvider>
        //         <SignupPage />
        //       </AuthProvider>
    );
}

export default App;
