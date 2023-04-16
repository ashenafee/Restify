import React from "react";
import './styles.css';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const { id, name, location, rating, availabilitiesOfProperty, imagesOfProperty } = property;
  const navigate = useNavigate();

  // remove later
  const renderAvailability = () => {
    console.log(name + " " + imagesOfProperty)
    if (availabilitiesOfProperty && availabilitiesOfProperty.length > 0) {
      return availabilitiesOfProperty.map(availability => (
        <div key={availability.id}>
          Availability: {availability.start_date} - {availability.end_date}
          <br />
          Price per night: ${availability.price_per_night}
        </div>
      ));
    } else {
      return <div>No availability information</div>;
    }
  };

  const handleCardClick = () => {
    // Redirect to property details page on card click
    navigate(`/property/${id}/details`);
  };

  return (
    <div className="card mb-4 box-shadow" onClick={handleCardClick}>
    {/* show the first image of the imagesOfProperty */}
    <div
      className="image-container card-img-top"
      style={{
        backgroundImage:
          imagesOfProperty && imagesOfProperty.length > 0
            ? `url(${imagesOfProperty[0].image})`
            : "none",
      }}
      alt={`Image of ${name}`}
    ></div>

    <div className="py-3 px-3">
        <h2>{name}</h2>
        <p>Location: {location}</p>
        <p>Rating: {rating}</p>

        {renderAvailability()}
      </div>
    </div>
  );
};

export default PropertyCard;