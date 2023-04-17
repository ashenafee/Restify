import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ButtonFilled } from '../Common/Button';
import FormInput from '../Common/FormInput';
import Footer from '../Common/Footer';
import jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";


const UserProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    avatar: '' // Update to null as avatar will be a file
  });

  const [errors, setErrors] = useState({
    nonfielderrors: "",
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    avatar: ''
});

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


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    // If the field is a file input, update the state with the selected file
    const fieldValue = type === 'file' ? files[0] : value;
    setFormData({ ...formData, [name]: fieldValue });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithFile = new FormData();
    formDataWithFile.append('username', formData.username);
    formDataWithFile.append('first_name', formData.first_name);
    formDataWithFile.append('last_name', formData.last_name);
    formDataWithFile.append('email', formData.email);
    formDataWithFile.append('phone_number', formData.phone_number);
    formDataWithFile.append('avatar', formData.avatar); // Append the avatar file to the FormData
    try {
        const access_token = localStorage.getItem('access_token');
        console.log ("user token on requ \n" + access_token)
      const response = await axios.put('http://127.0.0.1:8000/accounts/edit/', formDataWithFile, {
        headers: {
            Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update p ", error);
    
      if (error.response && error.response.data) {
          const errorData = error.response.data;
          setErrors({
          nonfielderrors: errorData.non_field_errors ? errorData.non_field_errors.join(" ") : "",
          username: errorData.username ? errorData.username.join(" ") : "",
          first_name: errorData.first_name ? errorData.first_name.join(" ") : "",
          last_name: errorData.last_name ? errorData.last_name.join(" ") : "",
          email: errorData.email ? errorData.email.join(" ") : "",
          phone_number: errorData.phone_number ? errorData.phone_number.join(" ") : "",
          avatar: errorData.avatar ? errorData.avatar.join(" ") : "",
          });
      }
    }
  }

  return (
    <div>
    {loggedIn ? (
      <div>
        <div className='container my-5'>
          <h1>User Profile</h1>
          <p className='my=3'>All field are required!</p>
          <form onSubmit={handleSubmit}>
            <label>
              Username:
            </label>
            <FormInput
              className = "mt-1 mb-3"
              placeholder="Change username"
              type="text"
              value={formData.username}
              name = "username"
              onChange={handleChange}
            />
            {errors.username && <p className="error-message">{errors.username}</p>}
            <label>
              First Name:
            </label>
            <FormInput
              className = "mt-1 mb-3"
              placeholder="Change first name"
              type="text"
              value={formData.first_name}
              name = "first_name"
              onChange={handleChange}
            />
            {errors.first_name && <p className="error-message">{errors.first_name}</p>}
            <label>
              Last Name:
            </label>
            <FormInput
              className = "mt-1 mb-3"
              placeholder="Change last name"
              type="text"
              value={formData.last_name}
              name = "last_name"
              onChange={handleChange}
            />
            {errors.last_name && <p className="error-message">{errors.last_name}</p>}
            <label>
              Email:
            </label>
            <FormInput
              className = "mt-1 mb-3"
              placeholder="Change email"
              type="email"
              value={formData.email}
              name = "email"
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
            <label>
              Phone Number:
            </label>
            <FormInput
              className = "mt-1 mb-3"
              placeholder="Change phone number"
              type="tel"
              value={formData.phone_number}
              name = "phone_number"
              onChange={handleChange}
            />
            {errors.phone_number && <p className="error-message">{errors.phone_number}</p>}
            <label>
              Avatar:
              {/* <input type="file" name="avatar" onChange={handleChange} /> */}
            </label>
            <FormInput
              className = "mt-1 mb-3"
              type="file"
              value={formData.avatar}
              name = "avatar"
              onChange={handleChange}
            />
            {errors.avatar && <p className="error-message">{errors.avatar}</p>}
            <ButtonFilled
                value="Update Profile"
                type="submit"
                onClick={() => {
                    window.location.reload();
                    console.log("Button clicked!");
                }}
            />
            {errors.nonfielderrors && <p className="error-message">{errors.nonfielderrors}</p>}
            </form>
        </div>   
      <Footer />
      </div> 
    ) : ( <p className="text-center">You are not authorized. Redirecting to login page...</p> )}
    </div>
  );
}

export default UserProfilePage;