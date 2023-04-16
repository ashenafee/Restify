import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './reservation.css';
import { Link } from 'react-router-dom';

function ReservationDetailList() {
  const [reservations, setReservation] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [filterState, setFilterState] = useState({
    role: "all",
    state: "all"
  });
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchReservation() {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };
        const { role, state } = filterState;
        let url = "http://localhost:8000/properties/reservation/list/?page=" + currentPage;
        if (role !== "all") {
          url += `&role=${role}`;
        }
        if (state !== "all") {
          url += `&state=${state}`;
        }
        const response = await fetch(url, { headers });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setPageCount(Math.ceil(data.count / 5));
          setReservation(data);
          setLoggedIn(true);
        }
      }
    }
    fetchReservation();
  }, [currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    const access_token = localStorage.getItem("access_token");
    const { role, state } = filterState;
    let url = "http://localhost:8000/properties/reservation/list/?page=1";
    setCurrentPage(1);
    if (role !== "all") {
      url += `&role=${role}`;
    }
    if (state !== "all") {
      url += `&state=${state}`;
    }

    console.log(url)
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
    setPageCount(Math.ceil(data.count / 5));
    setReservation(data);
  };
  const handlePageClick = (e) => {
    const newPage = Number(e.target.textContent);
    setCurrentPage(newPage);
  
  }

  
  return (
    <div className="container">
      <h1>My Reservation</h1>
      <form onSubmit={handleFilterSubmit}>
        <label>
          Role:
          <select name="role" value={filterState.role} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="host">Host</option>
            <option value="guest">Guest</option>
          </select>
        </label>
        <label>
          State:
          <select name="state" value={filterState.state} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Denied">Denied</option>
            <option value="Expired">Expired</option>
            <option value="Approved">Approved</option>
            <option value="Canceled">Canceled</option>
            <option value="Terminated">Terminated</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <button type="submit" className="to-property-button">Filter</button>
      </form>
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
          <div className="pagination-container">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(pageCount)].map((page, index) => (
              <button
                key={index + 1}
                className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
                onClick={handlePageClick}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageCount}
            >
              Next
            </button>
          </div>
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

