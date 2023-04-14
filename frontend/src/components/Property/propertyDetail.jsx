import React, { useState, useEffect } from 'react';

function PropertyDetail({ match }) {
  const [property, setProperty] = useState({});

  useEffect(() => {
    async function fetchProperty() {
      const response = await fetch(`/property/properties/${match.params.id}/view/`);
      const data = await response.json();
      setProperty(data);
    }
    fetchProperty();
  }, [match.params.id]);

  return (
    <div>
      <h1 id="property_name">{property.name}</h1>
      <p id="address">{property.address}</p>
      <p id="property_description">{property.description}</p>
      <ul id="amenities">
        {property.amenities && property.amenities.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
      <p id="owner_email">Contact: {property.host && property.host.email}</p>
    </div>
  );
}

export default PropertyDetail;
