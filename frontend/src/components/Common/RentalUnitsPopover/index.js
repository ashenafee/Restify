import React, { useState, useEffect } from "react";
import { Button, Dropdown, Popover } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import {FaBed, FaToilet} from "react-icons/fa";
import {BsPeopleFill} from "react-icons/bs";

function RentalUnitsPopover() {
    const [rentalUnits, setRentalUnits] = useState(null);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);


    const fetchRentalUnits = async (accessToken) => {
        try {
            const response = await fetch("http://localhost:8000/accounts/properties/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setRentalUnits(data);
            }
        } catch (error) {
            // Pass
        }
    };

    // Handle the message from the login page
    window.addEventListener("newLogin", () => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            fetchRentalUnits(accessToken);
        }
    });

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            fetchRentalUnits(accessToken);
        }
    }, []);

    const rentalUnitsPopover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">My Rental Units</Popover.Header>
            <Popover.Body>
                {rentalUnits === null ?
                    (
                        <p>No rental units available.</p>
                ) : (
                        rentalUnits.map((unit) => (
                            <div key={unit.id} className={"d-flex flex-row align-items-center"}>
                                <div className={"d-flex flex-column p-2"}>
                                    <strong>{unit.name}</strong>
                                    <p>{unit.address}, {unit.location}</p>
                                </div>
                                <div className={"d-flex flex-column p-2 text-end"}>
                                    <div>
                                        {unit.guests} <BsPeopleFill/>
                                    </div>
                                    <div>
                                        {unit.beds} <FaBed/>
                                    </div>
                                    <div>
                                        {unit.bathrooms} <FaToilet/>
                                    </div>
                                </div>
                            </div>
                )))}
            </Popover.Body>
        </Popover>
    );

    const isLoggedIn = localStorage.getItem("access_token") !== null;

    const renderButton = () => (
        <Button
            variant="outline-light"
            className="ms-2 py-3"
            style={{
                cursor: isLoggedIn ? "pointer" : "not-allowed",
            }}
            onClick={() => {
                if (isLoggedIn) {
                    navigate("profile/properties");
                }
            }}
        >
            My Rental Units
        </Button>
    );

    const handleRentalUnitClick = (id) => {
        navigate(`/property/${id}/update`);
    };

    const CustomToggle = React.forwardRef(({children, onClick}, ref) => {
        const handleClick = (e) => {
            e.preventDefault();
            onClick(e);
        };

        return (
            <Button
                ref={ref}
                onClick={handleClick}
                variant="outline-light"
                className="ms-2 py-3"
                style={{
                    cursor: isLoggedIn ? "pointer" : "not-allowed",
                }}
            >
                {children}
            </Button>
        );
    });

    return isLoggedIn ? (
        <Dropdown show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
            <Dropdown.Toggle as={CustomToggle}>
                My Rental Units
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {rentalUnits === null ? (
                    <Dropdown.Item>
                        <p>No rental units available.</p>
                    </Dropdown.Item>
                ) : (
                    rentalUnits.map((unit) => (
                        <Dropdown.Item
                            key={unit.id}
                            onClick={() => handleRentalUnitClick(unit.id)}
                            className={"d-flex flex-row align-items-center"}
                        >
                            <div className={"d-flex flex-column p-2"}>
                                <strong>{unit.name}</strong>
                                <p>{unit.address}, {unit.location}</p>
                            </div>
                            <div className={"d-flex flex-column p-2 text-end"}>
                                <div>
                                    {unit.guests} <BsPeopleFill />
                                </div>
                                <div>
                                    {unit.beds} <FaBed />
                                </div>
                                <div>
                                    {unit.bathrooms} <FaToilet />
                                </div>
                            </div>
                        </Dropdown.Item>
                    ))
                )}
            </Dropdown.Menu>
        </Dropdown>
    ) : (
        renderButton()
    );
}

export default RentalUnitsPopover;