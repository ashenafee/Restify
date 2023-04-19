import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './reservationDetail.css';
import { Link } from 'react-router-dom';


function ReservationDetail() {
  const { reservation_id} = useParams();
  const [property, setProperty] = useState({});
  const [username, setUsername] = useState({});
  const [reservation, setReservation] = useState({});
  const [cancelClicked, setCancelClick] =useState(false);
  const [cancelSuccess, setCancelSucess] = useState(false);
  const [cancelStatus, setCancelStatus] = useState('');

  useEffect(() => {
    async function fetchProperty() {
      const response1 = await fetch(`http://localhost:8000/properties/reservation/${reservation_id}/detail/`)
      const data1 = await response1.json();
      if (data1) {
        setReservation(data1);
      }
      else {
        console.log("not a valid reservation")
      }
      const response = await fetch(`http://localhost:8000/properties/property/${reservation.property_id}/view/`);
      const data = await response.json();
      if (data) {
        setProperty(data);
      }
      console.log(`I am looking for a property with this id ${reservation.property_id}`);
      console.log(property.name);
      fetchUsername();
    }
    fetchProperty();
  }, [reservation.property_id]);

  function fetchUsername() {
    // Get the access token from localStorage
    const accessToken = localStorage.getItem("access_token");

    // Get the user's username from the API
    fetch("http://localhost:8000/accounts/edit/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    }).then((response) => {

        if (response.status !== 200) {
            console.error("Failed to fetch user");
            return;
        }
        return response.json();
    }).then((data) => {
        if (!data) {
            return;
        }
        setUsername(data.username);
    });
}


  const updateData = async (e) => {
    const response1 = await fetch(`http://localhost:8000/properties/reservation/${reservation_id}/detail/`)
    const data1 = await response1.json();
    if (data1) {
      setReservation(data1);
    }
    else {
      console.log("not a valid reservation")
    }
    const response = await fetch(`http://localhost:8000/properties/property/${reservation.property_id}/view/`);
    const data = await response.json();
    if (data) {
      setProperty(data);
    }
    console.log(`I am looking for a property with this id ${reservation.property_id}`);
    console.log(property.name);
  }

  const handleCancel = async (e) => {
    const access_token = localStorage.getItem('access_token');
    e.preventDefault();

    if (!window.confirm("Are you sure you want to cancel?")) {
        return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/properties/reservation/${reservation_id}/cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      if (response.ok) {
        setCancelClick(true);
        setCancelSucess(true);
        setCancelStatus(response.data);
        updateData();
      } else {
        const data = await response.json();
        setCancelClick(true);
        setCancelSucess(false);
        setCancelStatus(data.error);
      }
    } catch (error) {
      console.error(error);
      setCancelClick(true);
      setCancelSucess(false);
      setCancelStatus('An error occurred while processing your request.');
    }
  };

  const handleApprove = async (e) => {
    const access_token = localStorage.getItem('access_token');
    e.preventDefault();
  
    try {
      const reservationData = new URLSearchParams();
      reservationData.append('state', "Approved");
      const response = await fetch(`http://localhost:8000/properties/reservation/${reservation_id}/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${access_token}`,

        },
        body: reservationData.toString(),
      });
  
      if (response.ok) {
        setCancelClick(true);
        setCancelSucess(true);
        setCancelStatus(response.data);
        updateDate();
      } else {
        const data = await response.json();
        setCancelClick(true);
        setCancelSucess(false);
        setCancelStatus(data.error);
      }
    } catch (error) {
      console.error(error);
      setCancelClick(true);
      setCancelSucess(false);
      setCancelStatus('An error occurred while processing your request.');
    }
  };

  const handleTerminate = async (e) => {
    const access_token = localStorage.getItem('access_token');
    e.preventDefault();

    if (!window.confirm("Are you sure you want to Terminate? You would incur fees in repayment.")) {
        return;
    }
  
    try {
      const reservationData = new URLSearchParams();
      reservationData.append('state', 'Terminated');
      const response = await fetch(`http://localhost:8000/properties/reservation/${reservation_id}/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${access_token}`,
  
        },
        body:reservationData.toString(),
      });
  
      if (response.ok) {
        setCancelClick(true);
        setCancelSucess(true);
        setCancelStatus(response.data);
        updateData();
      } else {
        const data = await response.json();
        setCancelClick(true);
        setCancelSucess(false);
        setCancelStatus(data.error);
      }
    } catch (error) {
      console.error(error);
      setCancelClick(true);
      setCancelSucess(false);
      setCancelStatus('An error occurred while processing your request.');
    }
  };

  const handleDeny = async (e) => {
    const access_token = localStorage.getItem('access_token');
    e.preventDefault();

    if (!window.confirm("Are you sure you want to Deny?")) {
        return;
    }
  
    try {
      const reservationData = new URLSearchParams();
      reservationData.append('state', "Denied");
      const response = await fetch(`http://localhost:8000/properties/reservation/${reservation_id}/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${access_token}`,


        },
        body:reservationData.toString(),

      });
  
      if (response.ok) {
        setCancelClick(true);
        setCancelSucess(true);
        setCancelStatus(response.data);
        updateData();
      } else {
        const data = await response.json();
        setCancelClick(true);
        setCancelSucess(false);
        setCancelStatus(data.error);
      }
    } catch (error) {
      console.error(error);
      setCancelClick(true);
      setCancelSucess(false);
      setCancelStatus('An error occurred while processing your request.');
    }
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

            <div className="col">
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
            </div>
          </div>
        </div>
        <div className="row">
            <div className="col">
            <h1>Review Your Booking</h1>
            <h4>{reservation.state}</h4>
        </div>  
        </div>
        <div className="row">
            <div className="col">
                <h4>Start Date: {reservation.start_date}</h4>
                <h4>End Date: {reservation.end_date}</h4>
            </div>
            <div class="col">
            <div className="row">
                <div className="col">
                  <h1>Review Your Booking</h1>
                <h4>{reservation.state}</h4>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <h4>Start Date: {reservation.start_date}</h4>
                <h4>End Date: {reservation.end_date}</h4>
              </div>
            </div>
            <div className="row">
              {reservation.property_owner === username ? (
                reservation.state === "Pending" ? (
                  <div className="col">
                  <h3>You are the host</h3>
                  <form action="leave-comment.html">
                    <button className="leave-comment-button">Leave a Comment</button>
                  </form>
                    <button className="cancel-booking-button" onClick={handleApprove}>Approve Request</button>
                    <button className="cancel-booking-button" onClick={handleDeny}>Deny Request</button>
                    {cancelClicked && cancelSuccess ? (
                    <h4>Your request has been processed succesfuly</h4>
                  ) : cancelClicked ? (
                    <h4>Your request has not been processed successfully</h4>
                  ) : null}
                  </div>
                ) : reservation.state === "Completed" || reservation.state === "Denied" || reservation.state === "Expired" || reservation.state === "Terminated"? null : (
                  <div className="col">
                  <h3>You are the host</h3>
                  <form action="leave-comment.html">
                    <button className="leave-comment-button">Leave a Comment</button>
                  </form>
                    <button className="cancel-booking-button" onClick={handleTerminate}>Terminate Reservation</button>
                    {cancelClicked && cancelSuccess ? (
                    <h4>Your request has been processed succesfuly</h4>
                  ) : cancelClicked ? (
                    <h4>Your request has not been processed successfully</h4>
                  ) : <h3>You are the host</h3>}
                  </div>
                )
              ) : reservation.state === "Approved" || reservation.state === "Pending" ? (
                <div className="col">
                  <h3>You are the guest</h3>
                  <form action="leave-comment.html">
                    <button className="leave-comment-button">Leave a Comment</button>
                  </form>
                  <form>
                    <button className="cancel-booking-button" onClick={handleCancel}>Request Cancel</button>
                  </form>
                  {cancelClicked && cancelSuccess ? (
                    <h4>Your request has been processed succesfuly</h4>
                  ) : cancelClicked ? (
                    <h4>Your request has not been processed successfully</h4>
                  ) : null}
                </div>
              ) : (
                <div className="col">
                  <h3>You are the guest</h3>
                  <form action="leave-comment.html">
                    <button className="leave-comment-button">Leave a Comment</button>
                  </form>
                </div>
              )}
            </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default ReservationDetail;
