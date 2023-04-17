import React from "react";
import { Link } from "react-router-dom";
import './styles.css';

const PropertyCard = ({ property }) => {
    return (
        <div className="card mb-4 box-shadow py-3 px-3">
            <h2>{property.name}</h2>
            <p>Address: {property.address}</p>
            <p>Location: {property.location}</p>
            
            <Link to={`/property/${property.id}/update`}>
                Manage Property
            </Link>
        </div>
    );
};

export default PropertyCard;
