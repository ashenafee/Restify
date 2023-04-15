import React from "react";
import { Image, NavDropdown } from "react-bootstrap";

function ProfileDropdown() {
    return (
        <>
            <Image className="ms-2" src="https://via.placeholder.com/50" roundedCircle />
            <NavDropdown className="ms-2 text-bg-primary" title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item href="#">Manage Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">My Reservations</NavDropdown.Item>
                <NavDropdown.Item href="#">My Properties</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Log Out</NavDropdown.Item>
            </NavDropdown>
        </>
    );
}

export default ProfileDropdown;
