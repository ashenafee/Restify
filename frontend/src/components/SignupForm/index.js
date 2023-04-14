import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";

function SignupForm({ handleSignup }) {
    const navigate = useNavigate();

    const [formFields, setFormFields] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (event, fieldName) => {
        setFormFields({ ...formFields, [fieldName]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await sendSignupDataToAPI(formFields);
        handleAPIResponse(response);
    };

    const sendSignupDataToAPI = async (data) => {
        try {
            const response = await fetch("http://localhost:8000/accounts/signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    password_confirm: data.confirmPassword,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    phone_number: data.phoneNumber,
                }),
                mode: "cors",
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                throw errorData;
            }
            return { ok: response.ok, errorData: null };
        } catch (errorData) {
            return { ok: false, errorData };
        }
    };

    const handleAPIResponse = (response) => {
        if (response.ok) {
            handleSignup();
            navigate("/");
            clearFormFields();
        } else {
            setErrors(response.errorData);
        }
    };

    const clearFormFields = () => {
        setFormFields({
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
        });
    };

    return (
        <Form onSubmit={handleSubmit} className={ "d-flex flex-column w-100 px-5 py-5" }>
            {Object.entries(formFields).map(([fieldName, fieldValue]) => (
                <InputField
                    key={fieldName}
                    label={getFieldLabel(fieldName)}
                    type={getFieldType(fieldName)}
                    placeholder={getFieldPlaceholder(fieldName)}
                    value={fieldValue}
                    error={errors[fieldName] && errors[fieldName][0]}
                    onChange={(event) => handleChange(event, fieldName)}
                />
            ))}
            <Button variant="primary" type="submit">
                Sign up
            </Button>
            {errors.detail && <p style={{ color: "red" }}>Error: {errors.detail}</p>}
        </Form>
    );
}

const getFieldLabel = (fieldName) => {
    const fieldLabels = {
        email: "Email address",
        username: "Username",
        password: "Password",
        confirmPassword: "Confirm Password",
        firstName: "First Name",
        lastName: "Last Name",
        phoneNumber: "Phone Number",
    };
    return fieldLabels[fieldName];
};

const getFieldPlaceholder = (fieldName) => {
    return `Enter ${getFieldLabel(fieldName).toLowerCase()}`;
};

const getFieldType = (fieldName) => {
    const fieldTypes = {
        email: "email",
        username: "text",
        password: "password",
        confirmPassword: "password",
        firstName: "text",
        lastName: "text",
        phoneNumber: "tel",
    };
    return fieldTypes[fieldName];
};

export default SignupForm;
