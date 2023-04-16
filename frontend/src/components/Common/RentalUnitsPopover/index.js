import React, { useState, useEffect } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";

function RentalUnitsPopover() {
    const [rentalUnits, setRentalUnits] = useState([]);

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
                setRentalUnits(data.results);
            } else {
                console.error("Failed to fetch rental units");
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                {rentalUnits !== undefined ? (
                    rentalUnits.map((unit) => (
                        <div key={unit.id}>
                            <strong>{unit.name}</strong>
                            <p>{unit.address}, {unit.city}, {unit.country}</p>
                        </div>
                    ))
                ) : (
                    <p>No rental units available.</p>
                )}
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={rentalUnitsPopover}>
            <Button variant="outline-light" className="ms-2 py-3">
                My Rental Units
            </Button>
        </OverlayTrigger>
    );
}

export default RentalUnitsPopover;
