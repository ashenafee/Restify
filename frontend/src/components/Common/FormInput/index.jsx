import React from "react";
import './styles.css';
import "bootstrap/dist/css/bootstrap.min.css";


const FormInput = ({ className, placeholder, type, value, onChange, name, required }) => {
    return (
        <input
          className={className}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          name={name}
          required={!!required}
        />
    );
  };

export default FormInput;