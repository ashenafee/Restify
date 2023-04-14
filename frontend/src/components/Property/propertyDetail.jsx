import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './property.css';

function PropertyDetail() {
  const { property_id } = useParams();
  const [property, setProperty] = useState({});

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
          <div className="col">
            <ul className="comment-list">
              {property.commentsOftheProperty?.map((comment) => (
                <li className="comment-section" key={comment.id}>
                  <h3>{comment.author_name}</h3>
                  <h4 className="rating-number">{comment.rating}</h4>
                  <p>{comment.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyDetail;
