import React, { useState, useEffect } from "react";
import PropertyCard from "./propertyCard";
import { Container, Row, Col } from "react-bootstrap";
import { H1 } from "../Common/Headers";
import { useNavigate } from "react-router-dom";
import { ButtonFilled } from '../Common/Button';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [unauthorized, setUnauthorized] = useState(false); // State for unauthorized status
    const navigate = useNavigate();


    useEffect(() => {
        // Fetch properties from the API
        fetch('http://127.0.0.1:8000/accounts/properties/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            // redirect to login
            .then((response) => {
                // Check if response is unauthorized
                if (response.status === 401) {
                    setUnauthorized(true);
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000); // 2 seconds delay
                    return;
                }
                return response.json();
            })
            .then((data) => setProperties(data))
            .catch((error) => console.error('Error fetching properties:', error));
    }, []);

    return (
        <div>
            <H1 value={"My Properties"} className = "mt-3"/>

            <div>
                {unauthorized ? ( // Use unauthorized status to conditionally render message
                    <p className="text-center">You are not authorized. Redirecting to login page...</p>
                ) : (
                    Array.isArray(properties) && properties.length > 0 ? (
                        // if properties exist
                        <Container>
                            <Row>
                                {properties.map((property) => (
                                    <Col key={property.id} xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <PropertyCard property={property} />
                                    </Col>
                                ))}
                            </Row>

                            <Row>
                                <ButtonFilled 
                                    value={"Add Property"} 
                                    onClick={() => navigate("/property/create")} />
                            </Row>
                        </Container>
                    ) : (
                        // if no properties exist
                        <div>
                            <p className="text-center">No properties found</p>

                            <ButtonFilled 
                                value={"Add Property"} 
                                onClick={() => navigate("/property/create")} />
                        </div>
                    )
                )}
            </div>

        </div>
    );
};

export default MyProperties;