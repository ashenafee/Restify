import React from "react";
import './styles.css';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const { id, name, location, guests, beds, bathrooms, rating, amenities, availabilitiesOfProperty, imagesOfProperty } = property;
  const navigate = useNavigate();

  const renderAvailability = () => {
    if (availabilitiesOfProperty && availabilitiesOfProperty.length > 0) {
      return availabilitiesOfProperty.map(availability => (
        <div key={availability.id}>
          <b>Availability: </b> {availability.start_date} - {availability.end_date}
          <br />
          <b>Price per night:</b> ${availability.price_per_night}
        </div>
      ));
    } else {
      return <div>No availability information</div>;
    }
  };

  const renderAmenities = () => {
    if (amenities && amenities.length > 0) {
      return (
        <ul>
          {amenities.map(amenity => (
            <li key={amenity.id}>
              {amenity.name}
            </li>
          ))}
        </ul>
      );
    } else {
      return <div>No amenities</div>;
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
        <p> <b>Location: </b> {location}</p>
        <p> <b>Guests:</b> {guests}</p>
        <p> <b>Bathrooms:</b> {bathrooms}</p>
        <p><b> Beds: </b>{beds}</p>
        {renderAmenities()}
        < br />
        {/* <p>Amenities: {amenities}</p> */}
        <p><b>Rating: </b>{rating}</p>

        {renderAvailability()}
      </div>
    </div>
  );
};

export default PropertyCard;