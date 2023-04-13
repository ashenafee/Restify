import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

// functional component, acts as Provider for AuthContext
// It wraps its children prop with the AuthContext.Provider component, 
// which sets the value prop to an object containing the user, token, and signup values.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Signup function to handle user registration
  const signup = async (userData) => {
    try {
        const formData = new FormData();
        console.log("Hello this is userData", userData)


        for (const key in userData) {
        formData.append(key, userData[key]);
        }
       console.log("Hello this is formData", formData)
       const response = await axios.post('http://127.0.0.1:8000/accounts/signup/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Update Content-Type header
        },
    });

      if (response.status === 200) {
        // You can access the access token and refresh token from the response
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;

        // Update user and token state variables
        setUser(response.data.user); // Update user state with user data from response
        setToken(accessToken); // Update token state with access token from response
        setRefreshToken(refreshToken); // Update refresh token state with refresh token from response

        return response.data;
      } 
      else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
        console.error(error);
        throw error;
      }
  };

  // Value prop for AuthContext.Provider, which contains the user, token, and signup function
  const authContextValue = {
    user,
    token,
    signup,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};