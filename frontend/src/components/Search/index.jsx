import React, { useState, useEffect, useContext } from 'react';
import PropertyCard from '../PropertyCard';
import { PropertyContext } from '../../context/PropertyContext';

import FormInput from "../Common/FormInput"; 
import {ButtonFilled, ButtonStroke} from '../Common/Button';
import { H1 } from "../Common/Headers";
import Footer from '../Common/Footer';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SortButton from '../SortDropdown'; 

import { useNavigate } from 'react-router-dom';


const PropertySearch = () => {
    const [location, setLocation] = useState('');
    const [guests, setGuests] = useState('');
    const [amenities, setAmenities] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
  
    const [sort, setSort] = useState('');
    const [order, setOrder] = useState('');
  
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
  
    const { properties, setProperties } = useContext(PropertyContext);
    const navigate = useNavigate();
  
    // Fetch properties from backend on component mount
    useEffect(() => {
      fetchProperties();
    }, [currentPage, sort, order]);
  
    // Fetch properties from backend based on search criteria
    const fetchProperties = async () => {
      try {
        // Construct the final URL with query parameters
        let finalUrl = `http://localhost:8000/search/catalog/?page=${currentPage}`;
        const queryParams = [];
  
        if (location) {
          queryParams.push(`location=${location}`);
        }
        if (guests) {
          queryParams.push(`guests=${guests}`);
        }
        if (amenities) {
          queryParams.push(`amenities=${amenities}`);
        }
        if (start_date) {
          queryParams.push(`start_date=${start_date}`);
        }
        if (end_date) {
          queryParams.push(`end_date=${end_date}`);
        }
        if (sort && order) {
          if (sort === 'price' || sort === 'rating') {
            queryParams.push(`sort=${sort}`);
            queryParams.push(`order=${order}`);
          }
        }
  
        if (queryParams.length > 0) {
          finalUrl += `&${queryParams.join('&')}`;
        }
  
        const response = await fetch(finalUrl);
        const data = await response.json();
        setProperties(data.results);
        setPageCount(Math.ceil(data.count / 4));
  
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }
  
    const handlePageClick = (e) => {
      const newPage = Number(e.target.textContent);
      setCurrentPage(newPage);
    }
  
    // Handle search button click
    const handleSearch = () => {
      setCurrentPage(1);
      fetchProperties();
    };
  
    // Handle sort button click
    const handleSort = (sortType, sortOrder) => {
      setSort(sortType);
      setOrder(sortOrder);
      setCurrentPage(1);
    };
  
    // Handle reset button click
    const handleReset = () => {
      setLocation('');
      setGuests('');
      setAmenities('');
      setStartDate('');
      setEndDate('');
      setSort('');
      setOrder('');
      setCurrentPage(1);
      fetchProperties();
    };

return (
    <div>
<div className = "container">
    <H1 className = "mt-4" value= {"Property Search"} />
    
    <div>
    <label>Location:</label>
    <FormInput
        className = "mt-1 mb-3"
        placeholder="e.g. london"
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
    />
    </div>
    <div>
    <label>Guests:</label>
    <FormInput
        className = "mt-1 mb-3"
        placeholder="e.g. 2"
        type="number"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
    />
    </div>
    <div>
    <label>Amenities:</label>
    <FormInput
        className = "mt-1 mb-3"
        placeholder="e.g. wi-fi"
        type="text"
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
    />
    </div>
    <div>
    <label>Start Date:</label>
    <FormInput
        className = "mt-1 mb-3"
        placeholder="e.g. wi-fi"
        type="date"
        value={start_date}
        onChange={(e) => setStartDate(e.target.value)}
    />
    </div>
    <div>
    <label>End Date:</label>
    <FormInput
        className = "mt-1 mb-3"
        placeholder="e.g. wi-fi"
        type="date"
        value={end_date}
        onChange={(e) => setEndDate(e.target.value)}
    />
    </div>

    <div className='d-flex'>
    <ButtonFilled
        value="Search"
        onClick={handleSearch}
    />    
    <div className='mx-2'></div>
    <ButtonStroke
        value="Reset"
        onClick={handleReset}
    />    
    
    </div>

    <hr />

    <div className="dropdown mb-4">
        <SortButton handleSort={handleSort} />
    </div>

    <Container>
    <Row>
        {properties.map((property) => (
        <Col key={property.id} xs={12} sm={6} md={4} lg={4} xl={4}>
            <PropertyCard
            property={property}
            onClick={() => {
                // Redirect to property details page on card click
                navigate(`/properties/property/${property.id}/view/`);
            }}
            />
        </Col>
        ))}
    </Row>
    </Container>

    <div className="pagination-container">
        <button
            className={`pagination-button currentPage === 1 ? 'disabled' : ''`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
        >
            Previous
        </button>
        {Array.from({ length: pageCount }, (_, i) => (
            <button
            key={i + 1}
            className={`pagination-button currentPage === i + 1 ? 'active' : ''`}
            onClick={() => setCurrentPage(i + 1)}
            >
            {i + 1}
            </button>
        ))}
        <button
            className={`pagination-button currentPage === pageCount ? 'disabled' : ''`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pageCount}
        >
            Next
        </button>
    </div>

</div >
    <Footer />
</div>
);
};

export default PropertySearch;