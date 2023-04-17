import React from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
    return (
        <div className="property-card">
            <h2>{property.name}</h2>
            <p>Address: {property.address}</p>
            <p>Location: {property.location}</p>
            
            {/* change link later */}
            <Link to={`/property/${property.id}/details`}>
                View Details
            </Link>
        </div>
    );
};

export default PropertyCard;
