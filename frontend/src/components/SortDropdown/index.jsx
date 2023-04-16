import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const SortButton = ({ handleSort }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="primary" id="sortDropdown">
                Sort by
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSort('price', 'asc')}>
                    Price Ascending
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort('price', 'desc')}>
                    Price Descending
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort('rating', 'asc')}>
                    Rating Ascending
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort('rating', 'desc')}>
                    Rating Descending
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SortButton;
