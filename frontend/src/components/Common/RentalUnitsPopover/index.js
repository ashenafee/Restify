import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";

function RentalUnitsPopover() {
    const rentalUnitsPopover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">My Rental Units</Popover.Header>
            <Popover.Body>
                <div>
                    <strong>Unit 1</strong>
                    <p>123 Main St, City, Country</p>
                </div>
                <div>
                    <strong>Unit 2</strong>
                    <p>456 Second Ave, City, Country</p>
                </div>
                {/* Add more rental units here */}
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
