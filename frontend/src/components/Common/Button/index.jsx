import React from "react";
import './styles.css';
import "bootstrap/dist/css/bootstrap.min.css";

const ButtonFilled = ({ value, type, onClick }) => {
    return (
      <button
        className="btn-filled"
        type={type}
        onClick={onClick}
      >
        {value}
      </button>
    );
  };

  const ButtonStroke = ({ value, type, onClick }) => {
    return (
      <button
        className="btn-stroke"
        type={type}
        onClick={onClick}
      >
        {value}
      </button>
    );
  };

export {ButtonFilled, ButtonStroke};