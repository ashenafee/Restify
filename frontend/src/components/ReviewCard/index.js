import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import Review from '../Review';

const ReviewCard = ({ title, endpoint }) => {
    const [userId, setUserId] = useState(null);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        fetchUserId();
    }, []);

    const fetchUserId = async () => {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/accounts/edit/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({}),
        });
        const data = await response.json();
        setUserId(data.id);
        fetchRatings(data.id);
    };

    const fetchRatings = async (userId) => {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:8000/${endpoint}/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        setRatings(data);
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center border w-100 mb-2">
            <Card.Body className="d-flex flex-column w-100 p-3">
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {title === 'Guest Reviews' ? 'Reviews of your stays.' : 'Reviews from your guests.'}
                </Card.Subtitle>
                {ratings.map((rating, index) => (
                    <Review key={index} rating={rating.rating} comment={rating.comment} />
                ))}
            </Card.Body>
        </div>
    );
};

export default ReviewCard;
