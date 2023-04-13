import React from "react";
import './styles.css';
import "bootstrap/dist/css/bootstrap.min.css";

const H1 = ({ className, value }) => {
    return (
      <h1 className = {className}>
        {value}
      </h1>
    );
  };

const H2 = ({ className, value }) => {
    return (
        <h2 className = {className}>
          {value}
        </h2>
      );
  };
  
  const H3 = ({ className, value }) => {
    return (
        <h3 className = {className}>
          {value}
        </h3>
      );
  };

  export { H1, H2, H3 };
