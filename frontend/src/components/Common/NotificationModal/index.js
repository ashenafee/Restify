import React, { useState, useEffect } from "react";
import { Modal, Button, Pagination, Dropdown } from "react-bootstrap";
import {Bell, BellFill} from "react-bootstrap-icons";

function NotificationModal() {
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const[hovered, setHovered] = useState(false);
    const accessToken = localStorage.getItem("access_token");
    const isLoggedIn = accessToken !== null;

    const fetchNotifications = (page = 1) => {
        fetch(`http://localhost:8000/notifications/list/?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                if (response.status !== 200) {
                    console.error("Failed to fetch notifications");
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (!data) {
                    return;
                }
                setNotifications(data.results);
                setTotalPages(Math.ceil(data.count / 5));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (modalOpen) {
            fetchNotifications();
        }

    }, [modalOpen]);

    const handleClose = () => setModalOpen(false);
    const handleShow = () => setModalOpen(true);
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchNotifications(page);
    };

    const CustomToggle = React.forwardRef(({children, onClick}, ref) => {
        const handleHover = () => {
            setHovered(true);
            if (isLoggedIn) {
                fetchNotifications();
            }
        }
        const handleUnhover = () => {
            setHovered(false);
        }

        const handleClick = (e) => {
            e.preventDefault();
            onClick(e);
            setModalOpen(true);
            setHovered(false);
        }

        return (
            <Button
                ref={ref}
                onMouseEnter={handleHover}
                onMouseLeave={handleUnhover}
                onClick={handleClick}
                style={{
                    cursor: isLoggedIn ? "pointer" : "not-allowed",
                }}
            >
                {children}
            </Button>
        );
    });

    return (
        <>
            <Dropdown show={hovered} >
                <Dropdown.Toggle as={CustomToggle} >
                    {hovered && isLoggedIn ? <BellFill/> : <Bell/>}
                </Dropdown.Toggle>
                { hovered && isLoggedIn ?
                    <Dropdown.Menu onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        {notifications.length > 0 ? (
                            [
                                notifications.map((notification) => (
                                    <Dropdown.Item key={notification.id}>
                                        <strong>{notification.type}</strong>
                                        <p>{notification.text}</p>
                                        <small className="text-muted">
                                            {new Date(notification.date).toLocaleString()}
                                        </small>
                                    </Dropdown.Item>
                                )),
                                <Dropdown.Divider key="divider"/>,
                                <Dropdown.Item key="view-all" onClick={handleShow}>
                                    View all
                                </Dropdown.Item>,
                            ]
                        ) : (
                            <Dropdown.Item>
                                <p>No notifications...</p>
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                    :
                    <Dropdown.Menu onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        <Dropdown.Item>
                            <p>Log in to view notifications</p>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                }
            </Dropdown>

            <Modal show={modalOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notifications.length > 0 ? (
                        <ul className="list-unstyled">
                            {notifications.map((notification) => (
                                <li key={notification.id}>
                                    <strong>{notification.type}</strong>
                                    <p>{notification.text}</p>
                                    <small className="text-muted">
                                        {new Date(notification.date).toLocaleString()}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No notifications</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Pagination>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                                <Pagination.Item
                                    key={page}
                                    active={page === currentPage}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Pagination.Item>
                            )
                        )}
                    </Pagination>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NotificationModal;
