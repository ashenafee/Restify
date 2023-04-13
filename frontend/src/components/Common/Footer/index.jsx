import React from "react";
import './styles.css';
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
    return (
      <footer className="navbar px-2 mt-2 footer">
        <div className="container py-4 d-flex flex-row justify-content-between align-items-center">
            <a href="../index.html" className="navbar-brand restify-logo">Restify</a>
            <p className="my-0">© 2023 Restify</p>
        </div>   
      </footer>
    );
  };

export default Footer;