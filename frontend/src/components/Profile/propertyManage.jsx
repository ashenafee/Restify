import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ButtonFilled, ButtonStroke } from '../Common/Button';
import FormInput from '../Common/FormInput';
import Footer from '../Common/Footer';
import jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";


const PropertyUpdate = () => {
  const navigate = useNavigate();
  const { property_id } = useParams();

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
    // amenities: [],
  });

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
    // amenities: "",
});

  const [loggedIn, setLoggedIn] = useState(false);
  const [success, setSuccess] = useState(false);

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

    // get amenities list
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

    const handleDescription = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        };
        
    // const handleAmenities = (event) => {
    //     const selectedOptions = Array.from(event.target.selectedOptions, (option) => Number(option.value));
    //     setFormData({ ...formData, amenities: selectedOptions });
    //     };
                      

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    // If the field is a file input, update the state with the selected file
    const fieldValue = type === 'file' ? files[0] : value;
    setFormData({ ...formData, [name]: fieldValue });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(true);

    try {
        const access_token = localStorage.getItem('access_token');

        const response = await axios.post(`http://localhost:8000/properties/property/${property_id}/edit/`, formData, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'multipart/form-data'
          },
          data: formData // pass formData as the data parameter
        });
        console.log(response.data);

        setTimeout(() => {
            navigate("/profile/properties")
        }, 2000); // 2 seconds delay

      } catch (error) {
        setSuccess(false);
        console.error("Failed to update a property ", error);
    
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

  const handleNavigateToImages = async (e) => { 
    navigate(`/property/${property_id}/images`);
  }

  return (
    <div>
    {loggedIn ? (
      <div>
        <div className='container my-5'>
          <h1>Update Property</h1>
          <p className='my=3'>All field are required!</p>
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
            {/* <br />
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
            </label> */}
            <br />
            {errors.nonfielderrors && <p className="error-message">{errors.nonfielderrors}</p>}
            <ButtonFilled
                        value="Update Property"
                        type="submit"
                        onClick={() => {
                            console.log("Button clicked!");
                        }}
                    />
            {success && <p className="success-message">Property update successfully!</p>}
            </form> 
            <ButtonStroke value="Set images >" onClick={handleNavigateToImages} />
        </div>   
      <Footer />
      </div> 
    ) : ( <p className="text-center">You are not authorized. Redirecting to login page...</p> )}
    </div>
  );
}

export default PropertyUpdate;