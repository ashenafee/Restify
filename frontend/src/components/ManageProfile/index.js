import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

const ProfileCard = ({ icon, title, description, link }) => {
    const [isHovered, setIsHovered] = useState(false);

    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const cardStyle = isHovered
        ? { backgroundColor: 'var(--bs-primary)', color: 'white' }
        : {};

    return (
        <Col md={3} className={"mb-4"}>
            <Card
                className={"h-100"}
                style={cardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Card.Body>
                    <i className={`bi ${icon} h3 settings-icon`}></i>
                    <Card.Title className={"text-left mt-3"}>{title}</Card.Title>
                    <Card.Text className={"text-left"}>{description}</Card.Text>
                    <Card.Link
                        onClick={() => {
                            // Navigate to the link
                            navigate(link);
                        }}
                        className={"stretched-link"}
                        style={isHovered ? { color: 'white' } : {}}
                    ></Card.Link>
                </Card.Body>
            </Card>
        </Col>
    );
};


const ProfileCardArray = () => (
    <Row>
        <ProfileCard
            icon="bi bi-person-lines-fill"
            title="Personal info"
            description="Update your profile details"
            link="edit"
        />
        <ProfileCard
            icon="bi bi-house-check"
            title="My reservations"
            description="Review your reserved options"
            link="reservations"
        />
        <ProfileCard
            icon="bi bi-house"
            title="My properties"
            description="Manage your properties"
            link="properties"
        />
        <ProfileCard
            icon="bi bi-envelope-plus"
            title="Reviews"
            description="View both hosting and guest reviews"
            link="reviews.html"
        />
    </Row>
);

const ManageProfile = () => {
    return (
        <div className={"d-flex flex-column mt-4 mx-5 flex-sm-wrap"}>
            <div className={"d-flex text-left"}>
                <h1 className={"text-left"}>Account</h1>
            </div>
            <hr />
            <div className={"d-flex text-left"}>
                <h4 className={"text-left"}>Manage your experience</h4>
            </div>
            <ProfileCardArray />
        </div>
    );
};

export default ManageProfile;
