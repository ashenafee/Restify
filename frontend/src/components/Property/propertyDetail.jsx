import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './property.css';
import { Link } from 'react-router-dom';
import {ButtonFilled, ButtonStroke} from '../Common/Button';

import { useNavigate } from 'react-router-dom';


function PropertyDetail() {
  const { property_id } = useParams();
  const [property, setProperty] = useState({});
  const [sortedComments, setSortedComments] = useState([]);

  const navigate = useNavigate();

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

  const sortCommentsByCreatedAtDesc = () => {
    const commentsCopy = [...property.host_ratings];
    commentsCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setProperty({ ...property, host_ratings: commentsCopy });
    setSortedComments(true);
  };

  const sortCommentsByCreatedAtAsc = () => {
    const commentsCopy = [...property.host_ratings];
    commentsCopy.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    setProperty({ ...property, host_ratings: commentsCopy });
    setSortedComments(true);
  };

  const handleRent = async (e)  => {
    navigate(`/property/${property_id}/reserve`)
  }

  return (
    <>
      <div>
        <div className="row">
          <div className="col">
            <h1 id="property_name">{property.name}</h1>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="slideshow mb-3">
              <ul className="slideshow-images">
                {property.imagesOfProperty?.map((image, index) => (
                  <li key={index} style={{ backgroundImage: `url(${image.image})` }}></li>
                ))}
              </ul>
            </div>

              <p id="address"><b>Address: </b> {property.address}</p>
              <p id="location"><b>Location: </b>{property.location} </p>
              <p id="description"><b>Description: </b> 
                <p style={{ marginBottom: '10px' }} id="property_description">
                  {property.description}
                </p>
              </p>

              <p id="amenities"><b>Amenities: </b> </p>
              <ul id="amenities">
                {property.amenities && property.amenities.map((amenity) => (
                  <li key={amenity.id}>{amenity.name}</li>
                ))}
              </ul>

              <p id="owner_email">
                <b>Contact:{' '} </b>
                <a href={`mailto:${property.host && property.host.email}`}>
                  {property.host && property.host.email}
                </a>
              </p>
              {/* <h2 className="price-tag" id="price">
                120.60 per day
              </h2>
              <p style={{ fontSize: '10px' }}>Tax and other fees not included</p> */}
              <form action="booking.html">

                <ButtonFilled onClick = {handleRent} value = {"Reat a property"} />

              </form>
          </div>

        {/* comments */}
        <h4 className="row justify-content-center">Comments</h4>
        <div className="row">
          <div className="col">
            <div className="comments">
            <div className="row">
              <div className="col-md-6 col-lg-6 d-flex justify-content-center px-0"> {/* Use col-md-6 for medium-sized screens and col-lg-6 for large screens */}
                <ButtonStroke onClick={sortCommentsByCreatedAtDesc} value="Earliest" className="mx-2 mb-2 " /> {/* Use mx-2 for horizontal margin and mb-2 for vertical margin */}
              </div>
              <div className="col-md-6 col-lg-6 d-flex justify-content-center px-0"> {/* Use col-md-6 for medium-sized screens and col-lg-6 for large screens */}
                <ButtonStroke onClick={sortCommentsByCreatedAtAsc} value="Latest" className="mx-2 mb-2" /> {/* Use mx-2 for horizontal margin and mb-2 for vertical margin */}
              </div>
            </div>

              {sortedComments
                ? property.host_ratings?.map((comment) => (
                  <div className="comment-section px-2 py-2" key={comment.id}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                      <div style={{borderRadius: '50%', width: '4rem', height: '4rem', overflow: 'hidden'}}>
                        <img src={comment.guest_photo} alt="Guest Photo" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      </div>
                      <h3 style={{marginLeft: '1rem'}}>{comment.guest}</h3>
                    </div>
                    <h4 className="rating-number">Rating: {comment.rating}</h4>
                    <p style={{wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word'}}>{comment.comment}</p> {/* Add CSS properties to prevent text overflow */}
                    <p className="create-at">
                      {' '}
                      <b>Created at:</b> {comment.created_at}
                    </p>
                  </div>                 
                  ))
                : property.host_ratings?.map((comment) => (
                  <div className="comment-section px-2 py-2" key={comment.id}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                      <div style={{borderRadius: '50%', width: '4rem', height: '4rem', overflow: 'hidden'}}>
                        <img src={comment.guest_photo} alt="Guest Photo" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      </div>
                      <h3 style={{marginLeft: '1rem'}}>{comment.guest}</h3>
                    </div>
                      <h4 className="rating-number">Rating: {comment.rating}</h4>
                      <p style={{wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word'}}>{comment.comment}</p> {/* Add CSS properties to prevent text overflow */}
                      <p className="create-at">
                        {' '}
                        <b>Created at:</b> {comment.created_at}
                      </p>
                  </div> 
                  ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default PropertyDetail;
