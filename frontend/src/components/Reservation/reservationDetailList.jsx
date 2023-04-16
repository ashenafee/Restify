import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './reservation.css';
import { Link } from 'react-router-dom';

function ReservationDetailList() {
  const [reservations, setReservation] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchReservation() {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };
        const response = await fetch(`http://localhost:8000/properties/reservation/list`, { headers });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setReservation(data);
          setLoggedIn(true);
        }
      }
    }
    fetchReservation();
  }, []);

  const test_reservations = [
    {
      start_date: "27 April",
      end_date: "30 April",
      reservationsOfProperty: {
        name: "Cool property"
      },
      state: "completed"
    },
    {
      start_date: "10 April",
      end_date: "13 April",
      reservationsOfProperty: {
        name: "Not cool property"
      },
      state: "pending"
    },
    {
      start_date: "1 April",
      end_date: "3 April",
      reservationsOfProperty: {
        name: "Very cool property"
      },
      state: "completed"
    }
  ];

  return (
    <div className="container">
      <h1>My Reservation</h1>
      {loggedIn ? (
        <div className="trips-flexbox">
          {reservations.count > 0 ? (
            reservations.results.map((reservation) => (
              <div className='row'>
                <div className="col">
                  <h3>{reservation.property_name}</h3>
                  <h4>{reservation.property_adress}</h4>
                  <p className="booking-date">{reservation.start_date} - {reservation.end_date}</p><br></br>
                  <p className="active-booking">{reservation.state}</p>
                </div>
                <div className="col">
                  <form>
                  <Link to={`/reservation/${reservation.id}/detail`} className="to-property-button">
                Property Details
              </Link>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <h3>No reservations found</h3>
          )}
          <form action="index.html">
            <button className="find-trip-button" href="booking.html">Find a new booking</button>
          </form>
          <form action="index.html">
            <button className="find-trip-button" href="booking.html">Past booking</button>
          </form>
        </div>
      ) : (
        <div>
        <h3>Not logged in</h3>
        <Link to={`/login/`} className="to-property-button">
        Log in
        </Link>
        </div>
      )}
    </div>
  );
}

export default ReservationDetailList;

