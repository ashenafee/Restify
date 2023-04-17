import React, { useState, useEffect } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

function RentalUnitsPopover() {
    const [rentalUnits, setRentalUnits] = useState(null);

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
                            <div key={unit.id}>
                                <strong>{unit.name}</strong>
                                <p>{unit.address}, {unit.location}</p>
                                {/* Use Bootstrap icons to display the number of guests, bedrooms, and bathrooms */}
                                <p>
                                    <i className="bi bi-people-fill"></i> {unit.guests} guests
                                    <i className="bi bi-bed-fill ms-3"></i> {unit.bedrooms} bedrooms
                                    <i className="bi bi-bath-fill ms-3"></i> {unit.bathrooms} bathrooms
                                </p>
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
        >
            My Rental Units
        </Button>
    );

    return isLoggedIn ? (
        <OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={rentalUnitsPopover}>
            {renderButton()}
        </OverlayTrigger>
    ) : (
        renderButton()
    );
}

export default RentalUnitsPopover;