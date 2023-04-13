import './App.css';
import Navbar from "./components/Navbar";

function App() {
  return (
      <div className="App">
        <Navbar />
      </div>

// for this we should create router later to be able to navigate between pages
      // <AuthProvider>
      // <SignupPage />
      // </AuthProvider>
  );
}

export default App;
