import React from "react";
import { Form } from "react-bootstrap";

const InputField = ({ label, type, placeholder, value, error, onChange }) => {
    return (
        <Form.Group controlId={`formBasic${label.replace(" ", "")}`}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </Form.Group>
    );
};

export default InputField;
