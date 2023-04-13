import React, {  useContext, useState  } from 'react';

import FormInput from "../Common/FormInput"; // Import the reusable FormInput component
import ButtonFilled from '../Common/Button';
import { H1 } from "../Common/Headers";
import Footer from '../Common/Footer';

import "bootstrap/dist/css/bootstrap.min.css";
import './styles.css';

import { AuthContext, AuthProvider } from "../../context/AuthContext";

const SignupPage = () => {
    const { signup } = useContext(AuthContext); // Access the signup function from AuthContext

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirm: "",
  });

  // for errors
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  // Event handler for form submission
  const handleSignup = async (event) => {
    event.preventDefault();

      try {
        const response = await signup(formData); // Call the signup function with the form data
        console.log("Signup successful!", response);
        // Handle successful signup, e.g. redirect to dashboard or show success message
      } catch (error) {
        console.error("Failed to signup", error);

        if (error.response && error.response.data) {
            const errorData = error.response.data;
            setErrors({
            email: errorData.email ? errorData.email.join(" ") : "", 
            username: errorData.username ? errorData.username.join(" ") : "", 
            password: errorData.password ? errorData.password.join(" ") : "", // Join multiple errors into a string
            password_confirm: errorData.non_field_errors ? errorData.non_field_errors.join(" ") : "", // non_field_errors, cause this is what we have in response
            first_name: errorData.first_name ? errorData.first_name.join(" ") : "", 
            last_name: errorData.last_name ? errorData.last_name.join(" ") : "", 
            phone_number: errorData.phone_number ? errorData.phone_number.join(" ") : "", 
            });
        }
      }
  }

  const handleChange = (e) => {
    console.log("Change called");

    setFormData({
        ...formData, [e.target.name]: e.target.value
     });
  };
  
    return (
    <div className="d-flex flex-column vh-100">
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <H1 value={"Welcome to Restify!"}/>
            <form onSubmit={handleSignup} className='form-signin'>
                <FormInput
                className = "my-3"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                required={true}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
                <br />
                <FormInput
                className = "my-3"
                placeholder="Username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                name="username"
                required={true}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
                <br />
                <FormInput
                className = "my-3"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                required={true}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
                <br />
                <FormInput
                className = "my-3"
                placeholder="Confirm Password"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                name="password_confirm"
                required={true}
                />
                {errors.password_confirm && <p className="error-message">{errors.password_confirm}</p>}
                <br />
                <FormInput
                className = "my-3"
                placeholder="First Name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                name="first_name"
                required={true}
                />
                {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                <br />
                <FormInput
                className = "my-3"
                placeholder="Last Name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                name="last_name"
                required={true}
                />
                {errors.last_name && <p className="error-message">{errors.last_name}</p>}
                <br />
                <FormInput
                className = "my-3"
                placeholder="Phone Number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                name="phone_number"
                required={true}
                />
                {errors.phone_number && <p className="error-message">{errors.phone_number}</p>}
                <br />
                <ButtonFilled
                    value="Sign me up!"
                    type="submit"
                    onClick={() => {
                        // Define your click event handler logic here
                        console.log("Button clicked!");
                    }}
                />
            </form>
        </div>
      <Footer/>
    </div>
  );
}

export default SignupPage;