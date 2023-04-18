import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ButtonFilled, ButtonStroke } from '../Common/Button';
import FormInput from '../Common/FormInput';
import Footer from '../Common/Footer';
import jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";


const PropertyImages = () => {
  const navigate = useNavigate();
  const { property_id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    image: null,
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
    const { name, type, files } = e.target;
    // If the field is a file input, update the state with the selected file
    const fieldValue = type === 'file' ? files : e.target.value;
    // Check if files property is not empty before appending to formDataObj
    if (type === 'file' && files.length > 0) {
      setFormData({ ...formData, [name]: [...files] }); // Update to use an array instead of an object for images
      console.log("1 file added")
    } else {
      setFormData({ ...formData, [name]: fieldValue });
      console.log("another data")
    }
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

      const formDataObj = new FormData();
      for (const key in formData) {
        if (key === 'image') {
          const files = formData.image;
          for (const file of files) {
            formDataObj.append('image', file);
            formDataObj.append('name', file.name);
          }
        } else {
          formDataObj.append(key, formData[key]);
        }
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };

      await axios.post(`http://localhost:8000/properties/images/${property_id}/add/`, formDataObj, config);

      setSuccess(true);
    } catch (error) {
        console.error('Failed to add images:', error);
    }
  };

  const handleNavigateToAvailability = async (e) => { 
    navigate('/property/:property_id/availability')
  }


  return (
    <div>
    {loggedIn ? (
      <div>
        <div className='container my-5 vh-100'>
          <h1>Add Image to your Property</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" name="image" multiple onChange={handleChange} />
            <ButtonFilled value="Save" type="submit" className={{ width: '100%' }}/>
            {success && <p className="success-message">Images added successfully!</p>}
          </form>
          <ButtonStroke value="Set availability dates >" className={{ width: '50%' }} onClick={handleNavigateToAvailability} />
        </div>   
      <Footer />
      </div> 
    ) : ( <p className="text-center">You are not authorized. Redirecting to login page...</p> )}
    </div>
  );
}

export default PropertyImages;