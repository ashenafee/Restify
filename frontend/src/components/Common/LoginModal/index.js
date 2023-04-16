import React, {useContext, useState} from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import {AuthContext} from "../../../context/AuthContext";

function LoginModal({ show, handleClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { login } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            await login(username, password);
            handleClose();
        } catch (error) {
            setError("Invalid username or password.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Log In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Log In
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;
