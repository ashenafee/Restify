import {createContext, useState} from "react";
import axios from "axios";

export const PropertyCreateContext = createContext();

export const PropertyCreateProvider = ({children}) => {

    // Signup function to handle user registration
    const createProperty = async (propertyData) => {
        try {
            const formData = new FormData();
            console.log("Hello this is propertyData", propertyData)


            for (const key in propertyData) {
                formData.append(key, propertyData[key]);
            }
            console.log("Hello this is formData", formData)

            const access_token = localStorage.getItem('access_token');
            if (access_token) {
                console.log("this is access_token in Context", access_token)
                const headers = {
                  Authorization: `Bearer ${access_token}`,
                //   'Content-Type': 'multipart/form-data',
                };

                const response = await axios.post('http://localhost:8000/properties/property/add/', formData, {
                    // headers: {
                    //     //'Content-Type': 'multipart/form-data',
                    // },
                    headers: headers,
                });

                if (response.status === 200) {
                    console.log("Property created")
                    return response.data;
                } else {
                    throw new Error("Something went wrong");
                }
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const propertyContextValue = {
        createProperty
    };

    return (
        <PropertyCreateContext.Provider value={propertyContextValue}>
            {children}
        </PropertyCreateContext.Provider>
    );
};