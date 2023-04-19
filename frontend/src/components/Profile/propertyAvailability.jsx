import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ButtonFilled, ButtonStroke } from '../Common/Button';
import FormInput from '../Common/FormInput';
import Footer from '../Common/Footer';
import jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";


const PropertyAvailability = () => {
  const navigate = useNavigate();
  const { property_id } = useParams();

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    price_per_night: "",
  });

  const [errors, setErrors] = useState('');

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
                      

  const handleChange = (e) => {
    console.log("change called")
    const { name, value } = e.target;
    setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
    }));
  };  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        throw new Error('Access token not found.');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };

      console.log('formData:', formData);

      await axios.post(`http://localhost:8000/properties/property/${property_id}/availability/`, formData, config);

      setSuccess(true);
    } catch (error) {
        setSuccess(false);
        console.error('Failed to add availability:', error);

        if (error.response && error.response.data) {
            const errorData = error.response.data;
            setErrors({
            nonfielderrors: errorData.non_field_errors ? errorData.non_field_errors.join(" ") : "",
            start_date: errorData.start_date ? errorData.start_date.join(" ") : "",
            end_date: errorData.end_date ? errorData.end_date.join(" ") : "",
            price_per_night: errorData.price_per_night ? errorData.price_per_night.join(" ") : "",
            });
        }
    }
  };

  const handleNavigateToMyProperties = async (e) => { 
    navigate("/profile/properties")
  }


  return (
    <div>
    {loggedIn ? (
      <div>
        <div className='container my-5 vh-100'>
          <h1>Add Availability for your Property</h1>
          <form onSubmit={handleSubmit}>

    <div>
    <label>Start Date:</label>
    <input
        className="mt-1 mb-3"
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        min={new Date().toISOString().split('T')[0]}
        />
    {errors.start_date && <p className="error-message">{errors.start_date}</p>}

    </div>

    <div>
    <label>End Date:</label>
    {/* <FormInput
        className = "mt-1 mb-3"
        type="date"
        value={formData.end_date}
        onChange={handleChange}
    /> */}
    <input
        className="mt-1 mb-3"
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
        min={new Date().toISOString().split('T')[0]}
        />
    {errors.end_date && <p className="error-message">{errors.end_date}</p>}

    </div>

    <div>
    <label>Price per night:</label>
    <input
        className="mt-1 mb-3"
        type="number"
        step="0.01"
        name="price_per_night"
        value={formData.price_per_night}
        onChange={handleChange}
        min="0"
        />
    {errors.nonfielderrors && <p className="error-message">{errors.nonfielderrors}</p>}
    </div>

          <ButtonFilled value="Save" type="submit" className={{ width: '100%' }}/>
            {success && <p className="success-message">Availability added successfully!</p>}
            {errors.price_per_night && <p className="error-message">{errors.price_per_night}</p>}
          </form>

          <ButtonStroke value="Back to My Properties" className={{ width: '50%' }} onClick={handleNavigateToMyProperties} />
        </div>   
      <Footer />
      </div> 
    ) : ( <p className="text-center">You are not authorized. Redirecting to login page...</p> )}
    </div>
  );
}

export default PropertyAvailability;