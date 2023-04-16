import {createContext, useState} from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    // Fetch user data from backend
    const fetchUser = async () => {

        console.log("Fetching user...");

        // Tokens
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        try {
            const response = await axios.put(
                'http://localhost:8000/accounts/edit/',
                {},
                {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                console.log("User fetched successfully");
                setUser(response.data);
            } else {
                console.log("Error fetching user data");
            }
        } catch (error) {
            // If the access token is expired, try to get a new access token using the refresh token
            if (error.response.status === 401) {
                try {
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    if (response.status === 200) {
                        const accessToken = response.data.access;
                        const refreshToken = response.data.refresh;

                        // Update token state
                        setToken(accessToken);
                        setRefreshToken(refreshToken);

                        // Add the tokens to storage
                        localStorage.setItem('access_token', accessToken);
                        localStorage.setItem('refresh_token', refreshToken);
                    } else {
                        console.log("Error fetching user data");
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

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
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/accounts/login/', {
                username: username,
                password: password
            });

            if (response.status === 200) {
                // Access the access token and refresh token from the response
                const accessToken = response.data.access;
                const refreshToken = response.data.refresh;

                // Update user and token state variables
                setToken(accessToken);
                setRefreshToken(refreshToken);

                // Add the tokens to storage
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);

                // Fetch user data
                await fetchUser();

                return response.data;
            } else {
                throw new Error("Invalid username or password.");
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
        login,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};