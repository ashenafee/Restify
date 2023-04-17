import React, { useState, useEffect } from "react";
import PropertyCard from "./propertyCard";
import { Container, Row, Col } from "react-bootstrap";
import { H1 } from "../Common/Headers";

const MyProperties = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        // Fetch properties from the API
        fetch('http://127.0.0.1:8000/accounts/properties/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setProperties(data))
            .catch((error) => console.error('Error fetching properties:', error));
    }, []);

    return (
        <div>
            <H1 value={"My Properties"} />

            <div>
                {Array.isArray(properties) && properties.length > 0 ? (
                    // if properties exist
                    <Container>
                        <Row>
                            {properties.map((property) => (
                                <Col key={property.id} xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <PropertyCard property={property} />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                ) : (
                    // if no properties exist
                    <p className="text-center">No properties found</p>
                )}
            </div>

        </div>
    );
};

export default MyProperties;