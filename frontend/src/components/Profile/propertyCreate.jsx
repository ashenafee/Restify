import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ButtonFilled } from '../Common/Button';
import { Link } from 'react-router-dom';
import FormInput from "../Common/FormInput"; // Import the reusable FormInput component
import Footer from '../Common/Footer';
import { useNavigate } from "react-router-dom";

import jwtDecode from 'jwt-decode';

import { PropertyCreateContext, PropertyCreateProvider } from "../../context/PropertyCreateContext";


const CreatePropertyForm = (props) => {
    const { createProperty } = useContext(PropertyCreateContext); 
    const navigate = useNavigate();

    const [amenities, setAmenities] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        location: "",
        guests: "",
        beds: "",
        bathrooms: "",
        description: "",
        // images: [],
        amenities: [],
      });

    // for errors
    const [errors, setErrors] = useState({
        nonfielderrors: "",
        name: "",
        address: "",
        location: "",
        guests: "",
        beds: "",
        bathrooms: "",
        description: "",
        // images: "",
        amenities: "",
    });

    const [success, setSuccess] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
    
        if (token) {
          // Decode JWT to get user information
          const decodedToken = jwtDecode(token);
    
          // Check if user is authorized based on decoded token
          if (decodedToken && decodedToken.exp > Date.now() / 1000) {
            console.log("logged in effect")
            // User is authorized, setLoggedIn to true
            setLoggedIn(true);
          } else {
            // User is not authorized, setLoggedIn to false and navigate to login page
            console.log("not logged in effect")
            setLoggedIn(false);
            setTimeout(() => {
                navigate("/login");
            }, 2000); // 2 seconds delay
          }
        } else {
          // JWT does not exist, setLoggedIn to false and navigate to login page
          console.log("not logged in effect")
          setLoggedIn(false);
          setTimeout(() => {
            navigate("/login");
        }, 2000); // 2 seconds delay
        }
      }, []);

      // get amenities
      useEffect(() => {
        const fetchAmenities = async () => {
          try {
            const response = await fetch("http://localhost:8000/properties/amenities/");
            const data = await response.json();
            setAmenities(data.results);
          } catch (error) {
            console.error("Failed to fetch amenities:", error);
          }
        };
        fetchAmenities();
      }, []);

  
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(true);
        try {
            const response = await createProperty(formData); 
            
            console.log("Property almost created!", response);
    
            if (typeof props.handleSubmit === 'function') {
                props.handleSubmit();
              }

            setTimeout(() => {
                navigate("/profile/properties")
            }, 2000); // 2 seconds delay

          } catch (error) {
            setSuccess(false);
            console.error("Failed to create a property ", error);
    
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setErrors({
                nonfielderrors: errorData.non_field_errors ? errorData.non_field_errors.join(" ") : "",
                name: errorData.name ? errorData.name.join(" ") : "",
                address: errorData.address ? errorData.address.join(" ") : "",
                guests: errorData.guests ? errorData.guests.join(" ") : "",
                beds: errorData.beds ? errorData.beds.join(" ") : "",
                bathrooms: errorData.bathrooms ? errorData.bathrooms.join(" ") : "",
                description: errorData.description ? errorData.description.join(" ") : "",
                // images: errorData.images ? errorData.images.join(" ") : "",
                amenities: errorData.amenities ? errorData.amenities.join(" ") : "",
                });
            }
          }
    }

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (type === "checkbox") {
          // For checkbox fields, update the `amenities` array based on whether the checkbox is checked or not
          if (checked) {
              // If checkbox is checked, add the amenity object to the `amenities` array
              setFormData(prevFormData => ({
                  ...prevFormData,
                  amenities: [
                      ...prevFormData.amenities,
                      { id: parseInt(value) } // assuming the `value` attribute of the checkbox is the ID of the amenity
                  ]
              }));
          } else {
              // If checkbox is unchecked, remove the amenity object from the `amenities` array
              setFormData(prevFormData => ({
                  ...prevFormData,
                  amenities: prevFormData.amenities.filter(amenity => amenity.id !== parseInt(value))
              }));
          }
      } else {
          // For other fields, update the `formData` object based on the field name and value
          setFormData(prevFormData => ({
              ...prevFormData,
              [name]: value
          }));
      }
  };
  

    const handleDescription = (e) => {
    setFormData({ ...formData, description: e.target.value });
    };

    // const handleImages = (e) => {
    //     console.log("Images added");

    //     setFormData({
    //         ...formData,
    //         images: [...e.target.files]
    //     });
    // };

    const handleAmenities = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => Number(option.value));
        setFormData({ ...formData, amenities: selectedOptions });
      };

  return (
    <div>
    {loggedIn ? (
    <div> 
      <h1>Create Property</h1>
        <div className="container">
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
          <FormInput
                className = "my-3"
                placeholder="Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                name="name"
                required={true}
            />
        {errors.name && <p className="error-message">{errors.name}</p>}
        <br />
        <label>
          Address:
        </label>
        <FormInput
                className = "my-3"
                placeholder="Address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                name="address"
                required={true}
            />
        {errors.address && <p className="error-message">{errors.address}</p>}
        <br />
        <label>
          Location:
        </label>
        <FormInput
                className = "my-3"
                placeholder="Location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                name="location"
                required={true}
            />
        {errors.location && <p className="error-message">{errors.location}</p>}
        <br />
        <label>
          Guests:
        </label>
        <FormInput
                className = "my-3"
                placeholder="Guests"
                type="number"
                value={formData.guests}
                onChange={handleChange}
                name="guests"
                required={true}
            />
        {errors.guests && <p className="error-message">{errors.guests}</p>}
        <br />
        <label>
          Beds:
        </label>
        <FormInput
                className = "my-3"
                placeholder="Beds"
                type="number"
                value={formData.beds}
                onChange={handleChange}
                name="beds"
                required={true}
            />
        {errors.beds && <p className="error-message">{errors.beds}</p>}
        <br />
        <label>
          Baths:
        </label>
        <FormInput
                className = "my-3"
                placeholder="Bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                name="bathrooms"
                required={true}
            />
        {errors.bathrooms && <p className="error-message">{errors.bathrooms}</p>}
        <br />
        <label>
          Description:
          <textarea
          name="description"
          value={formData.description}
          onChange={handleDescription}
        />
        </label>
        {errors.description && <p className="error-message">{errors.description}</p>}
        <br />
        {/* <label>
          Images:
          <input type="file" multiple onChange={handleImages} />
        </label> */}
        {/* {errors.images && <p className="error-message">{errors.images}</p>} */}
        <br />
        <label>
            Amenities:
            <select multiple value={formData.amenities} onChange={handleAmenities}>
                {amenities.map((amenity) => (
                    <option key={amenity.id} value={amenity.id}>
                    {amenity.name}
                    </option>
                ))}
            </select>
            {errors.amenities && <p className="error-message">{errors.amenities}</p>}
            <br />
        </label>
        <br />
        {errors.nonfielderrors && <p className="error-message">{errors.nonfielderrors}</p>}
        <ButtonFilled
                    value="Create Property"
                    type="submit"
                    onClick={() => {
                        console.log("Button clicked!");
                    }}
                />
        {success && <p className="success-message">Property created successfully!</p>}
        </form> 
        </div>
      <Footer />
    </div> 
    ) : (
        <p className="text-center">You are not authorized. Redirecting to login page...</p>
    )}
    </div>
  );
}

export default CreatePropertyForm;
