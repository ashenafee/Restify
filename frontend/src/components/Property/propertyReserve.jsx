import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './property.css';

function PropertyReserve() {
  const { property_id } = useParams();
  const [property, setProperty] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availability, setAvailability] = useState('');
  const [hasClickedCheck, setHasClickCheck] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      const response = await fetch(`http://localhost:8000/properties/property/${property_id}/view/`);
      const data = await response.json();
      if (data) {
        setProperty(data);
      }
      console.log(`I am looking for a property with this id ${property_id}`);
      console.log(property.name);
    }
    fetchProperty();
  }, [property_id]);

  const checkAvailability = (e) => {
    e.preventDefault();
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const available = property.availabilitiesOfProperty.some(avail => {
      const availStartDateTime = new Date(avail.start_date);
      const availEndDateTime = new Date(avail.end_date);
      if (startDateTime >= availStartDateTime && endDateTime <= availEndDateTime == true) {
        setAvailability(avail);
        return true;
      }
      else {
        return false;
      }
    });
    setHasClickCheck(true);
    setIsAvailable(available);
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 id="property_name">{property.name}</h1>
            <p>
              <nobr className="rating-number" id="rating">({property.rating || '-'})</nobr>
            </p>
            <p id="address">{property.address}</p>
          </div>
        </div>

        <div className="row">
        <div className="col">
          <div className="slideshow">
            <ul className="slideshow-images">
              {property.imagesOfProperty?.map((image, index) => (
                <li key={index} style={{ backgroundImage: `url(${image.image})` }}></li>
              ))}
            </ul>
          </div>

            <h2 style={{ marginBottom: '20px' }}>Description</h2>
            <p style={{ marginBottom: '10px' }} id="property_description">
              {property.description}
            </p>
            <ul id="amenities">
              {property.amenities && property.amenities.map((amenity) => (
                <li key={amenity.id}>{amenity.name}</li>
              ))}
            </ul>
            <p id="owner_email">
              Contact:{' '}
              <a href={`mailto:${property.host && property.host.email}`}>
                {property.host && property.host.email}
              </a>
            </p>
            {/* <h2 className="price-tag" id="price">
              120.60 per day
            </h2>
            <p style={{ fontSize: '10px' }}>Tax and other fees not included</p> */}
            <form action="booking.html">
              <button className="rent-button" href="booking.html">
                Rent
              </button>
            </form>
          </div>
        </div>
        <div className="row">
            <form>
                <label htmlFor="start-date">Select a start date</label>
                <input type="datetime-local" id="start-date" onChange={(e) => setStartDate(e.target.value)}></input>
                <br></br><br></br>
                <label htmlFor="end-date">Select an end date</label>
                <input type="datetime-local" id="end-date" onChange={(e) => setEndDate(e.target.value)}></input>
                <br></br><br></br>
                <button className="rent-button" id="check-availability-button" onClick={checkAvailability}>Check Availability</button>
            </form>
            {isAvailable ? (
                <form action="booking.html">
                    <p>The property is available at the given date</p>
                    <p>Price per night: {availability.price_per_night}</p>
                    <button className="rent-button" id="rent-confirmation-button">
                        Rent
                    </button>
                </form>
                ) : (
                hasClickedCheck && <p id="availability-error-check">The property is not available at the given date</p>
                )}
        </div>
      </div>
    </>
  );
}

export default PropertyReserve;
