import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ButtonFilled } from '../Common/Button';

const UserProfilePage = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    avatar: null // Update to null as avatar will be a file
  });

  const [errors, setErrors] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    avatar: ''
});

  const [loggedIn, setLoggedIn] = useState(false);

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
      console.error(error);
    }
  }

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    console.log ("user token on load \n" + access_token)
    if (access_token) {
        console.log("logged in effect")
      setLoggedIn(true);
    } else {
        console.log("not logged in effect")
      setLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      <p className='my=3'>All field are required!</p>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <label>
          First Name:
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Phone Number:
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
        </label>
        <label>
          Avatar:
          <input type="file" name="avatar" onChange={handleChange} />
        </label>
        <ButtonFilled
                    value="Update Profile"
                    type="submit"
                    onClick={() => {
                        window.location.reload();
                        console.log("Button clicked!");
                    }}
                />
        </form>
    </div>
  );
}

export default UserProfilePage;
