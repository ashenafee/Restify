import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function HomepageSearchBar() {
    const handleSearch = () => {
        window.location.href = "catalog.html";
    };

    return (
        <Container>
            <div className="search-bar">
                <Form>
                    <Row className="align-items-center my-3">
                        <Where />
                        <CheckIn />
                        <CheckOut />
                        <Guests />
                        <SearchButton handleSearch={handleSearch} />
                    </Row>
                </Form>
            </div>
        </Container>
    );
}

export default HomepageSearchBar;

function Where() {
    return (
        <Col lg={3} md={12}>
            <Form.Group>
                <Form.Label className="search-bar-heading">Where</Form.Label>
                <Form.Control type="text" id="destination" placeholder="Toronto" />
            </Form.Group>
        </Col>
    );
}

function CheckIn() {
    return (
        <Col lg={2} md={12}>
            <Form.Group>
                <Form.Label className="search-bar-heading">Check-in</Form.Label>
                <Form.Control type="text" id="checkin" placeholder="13 Feb 2023" />
            </Form.Group>
        </Col>
    );
}

function CheckOut() {
    return (
        <Col lg={2} md={12}>
            <Form.Group>
                <Form.Label className="search-bar-heading">Check-out</Form.Label>
                <Form.Control type="text" id="checkout" placeholder="15 Feb 2023" />
            </Form.Group>
        </Col>
    );
}

function Guests() {
    return (
        <Col lg={3} md={12}>
            <Form.Group>
                <Form.Label className="search-bar-heading">Guests</Form.Label>
                <Form.Control as="select" id="guests">
                    <option>2 guests</option>
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                </Form.Control>
            </Form.Group>
        </Col>
    );
}

function SearchButton({handleSearch}) {
    return (
        <Col lg={2} md={12}>
            <Button id="search-btn" className="add-prop" type="button" onClick={handleSearch}>
                Search
            </Button>
        </Col>
    );
}
