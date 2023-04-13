import './App.css';
import RestifyNavbar from "./components/Navbar";
import HomepageSearchBar from "./components/HomepageSearchBar";

function App() {
    return (
        <div className="App">
            <RestifyNavbar />
            <HomepageSearchBar />
        </div>

        // for this we should create router later to be able to navigate between pages
        //       <AuthProvider>
        //         <SignupPage />
        //       </AuthProvider>
    );
}

export default App;
