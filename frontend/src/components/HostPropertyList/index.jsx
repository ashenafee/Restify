import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        // Fetch properties from the API
        fetch('http://127.0.0.1:8000/accounts/properties/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setProperties(data))
            .catch((error) => console.error('Error fetching properties:', error));
    }, []);

    return (
        <div>
            <h1>My Properties</h1>
            <div className="property-cards">
                {Array.isArray(properties) && properties.length > 0 ? (
                    properties.map((property) => (
                        <div key={property.id} className="property-card">
                            <h2>{property.name}</h2>
                            <p>Address: {property.address}</p>
                            <p>Location: {property.location}</p>
                            <Link to={`/property/${property.id}/details`}>
                                View Details
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No properties found</p>
                )}
            </div>
        </div>
    );
};

export default MyProperties;