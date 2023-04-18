import React from 'react';
import ReviewCard from '../ReviewCard';
import { Container, Row, Col } from 'react-bootstrap';

function Reviews() {
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center w-100 mt-2">
            <h1>Reviews</h1>
            <Row className="w-100">
                <Col sm={12} md={6} className="d-flex justify-content-center">
                    <ReviewCard title={'Guest Reviews'} endpoint={'ratings/guest/list'} />
                </Col>
                <Col sm={12} md={6} className="d-flex justify-content-center">
                    <ReviewCard title={'Host Reviews'} endpoint={'ratings/host/list'} />
                </Col>
            </Row>
        </Container>
    );
}

export default Reviews;
