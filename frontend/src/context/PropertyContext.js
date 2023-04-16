import React, { createContext, useState } from "react";

// Create the PropertyContext
export const PropertyContext = createContext();

// Create a PropertyContextProvider component
export const PropertyContextProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);

  return (
    <PropertyContext.Provider value={{ properties, setProperties }}>
      {children}
    </PropertyContext.Provider>
  );
};