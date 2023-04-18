import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import NotificationIcon from "../NotificationIcon";
import RentalUnitsPopover from "../RentalUnitsPopover";
import ProfileDropdown from "../ProfileDropdown";
import { useNavigate } from "react-router-dom";

function RestifyNavbar() {
    const navigate = useNavigate();
    const [brandHovered, setBrandHovered] = useState(false);

    const handleMouseEnter = () => {
        setBrandHovered(true);
    };

    const handleMouseLeave = () => {
        setBrandHovered(false);
    };

    const brandStyle = {
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
    };

    const brandBgStyle = {
        position: "absolute",
        backgroundColor: "white",
        top: 0,
        left: brandHovered ? 0 : "-100%",
        width: "100%",
        height: "100%",
        transition: "all 0.4s",
    };

    const brandTextStyle = {
        position: "relative",
        color: brandHovered ? "#007bff" : "#fff",
    };

    return (
        <Navbar bg="primary" className="w-100">
            <Container className="justify-content-between w-100">
                <div
                    className="navbar-brand"
                    style={brandStyle}
                    onClick={() => {
                        navigate("/");
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div style={brandBgStyle}></div>
                    <div style={brandTextStyle}>Restify</div>
                </div>
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
