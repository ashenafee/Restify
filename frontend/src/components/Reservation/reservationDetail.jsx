import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './reservation.css';

function ReservationDetail() {
  const [reservations, setReservation] = useState({});

  useEffect(() => {
    async function fetchProperty() {
      const response = await fetch(`http://localhost:8000/properties/reservation/list`);
      const data = await response.json();
      if (data) {
        setReservation(data);
      }
    }
    fetchProperty();
  });

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
  ]
  return (
        <div className ="container">
                <h1>My Reservation</h1>
                <div className ="trips-flexbox">
                    {Array.isArray(test_reservations) ? (
                        test_reservations.map((reservation) => (
                            <div className='row'>
                                <div className="col">
                                    <h3>{reservation.reservationsOfProperty.name}</h3>
                                    <p className="booking-date">{reservation.start_date} - {reservation.end_date}</p>
                                    <p className="active-booking">{reservation.state}</p>
                                </div>
                                <div className="col">
                                    <form action="booking-details.html">
                                        <button className="to-property-button" href="booking.html">
                                            Go to booking details
                                        </button>
                                    </form>
                                    <form onclick="return confirm('Are you sure?')">
                                        <button className="cancel-booking-button" href="booking.html">
                                            Request Cancel
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h3>No reservations found</h3>
                )}
                            </div>
                <form action="index.html">
                    <button className = "find-trip-button" href="booking.html">Find a new booking</button>
                </form>
                <form action="index.html">
                    <button className = "find-trip-button" href="booking.html">Past booking</button>
                </form>
            </div>
  );
}

export default ReservationDetail;
