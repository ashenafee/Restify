import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { BsStar, BsStarFill } from 'react-icons/bs';

const Review = ({ rating, comment }) => {
    const [hover, setHover] = useState(false);

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<BsStarFill key={i} />);
            } else {
                stars.push(<BsStar key={i} />);
            }
        }
        return stars;
    };

    return (
        <Card className="mb-3" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <Card.Body>
                <div className="d-flex align-items-center">
                    <div className="rating-circle d-flex justify-content-center align-items-center mr-3">
                        {hover ? <>{renderStars()}</> : <>{rating}/5</>}
                    </div>
                    <div className={"vr mx-2"} style={
                        {
                            height: "3rem",
                        }}></div>
                    <Card.Text>{comment}</Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Review;
