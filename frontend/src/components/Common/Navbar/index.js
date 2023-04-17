import React from "react";
import { Container, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import NotificationIcon from "../NotificationIcon";
import RentalUnitsPopover from "../RentalUnitsPopover";
import ProfileDropdown from "../ProfileDropdown";

function RestifyNavbar() {
    return (
        <Navbar bg="primary" className="w-100">
            <Container className="justify-content-between w-100">
                <Navbar.Brand className="text-bg-primary" href="#home">
                    Restify
                </Navbar.Brand>
                <div className="d-flex flex-row align-items-center">
                    <NotificationIcon />
                    <RentalUnitsPopover />
                    <ProfileDropdown />
                </div>
            </Container>
        </Navbar>
    );
}

export default RestifyNavbar;
