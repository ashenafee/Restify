import React, { useState, useEffect } from "react";
import { Bell, BellFill } from "react-bootstrap-icons";
import { Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../NotificationModal";

function NotificationIcon() {
    const [hovered, setHovered] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const isLoggedIn = localStorage.getItem("access_token") !== null;

    const navigate = useNavigate();

    const CustomToggle = React.forwardRef(({children, onClick}, ref) => (
        <Button
            ref={ref}
            onMouseEnter={() => {
                setHovered(true);
                const accessToken = localStorage.getItem("access_token");
                if (accessToken) {
                    fetchNotifications(accessToken);
                }
            }}
            onMouseLeave={() => {
                setHovered(false);
            }}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
                const accessToken = localStorage.getItem("access_token");
                if (accessToken) {
                    fetchNotifications(accessToken);
                }
            }}
            style={{
                cursor: isLoggedIn ? "pointer" : "not-allowed",
            }}
        >
            {children}
        </Button>
    ));

    const CustomMenu = React.forwardRef(
        ({children, style, className, "aria-labelledby": labeledBy}, ref) => {
            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <ul className="list-unstyled">{children}</ul>
                </div>
            );
        }
    );

    const clearNotification = (notif_id) => {
        const accessToken = localStorage.getItem("access_token");
        fetch("http://localhost:8000/notifications/clear/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({notif_id}),
        })
            .then((response) => {
                if (response.status !== 200) {
                    console.error("Failed to clear notification");
                    return;
                }
                console.log("Notification cleared successfully");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchNotifications = (accessToken) => {
        fetch("http://localhost:8000/notifications/list/", {
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
                const notificationCards = data.results.map((notification) => {
                    var date = new Date(notification.date);
                    var text = notification.text;
                    var type = notification.type;

                    if (type === "notification") {
                        type = "Notification";
                    }

                    return (
                        <Dropdown.Item key={notification.id} href="#">
                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <div className="d-flex flex-column justify-content-between">
                                    <div>
                                        <strong>{type}</strong>
                                        <div>{text}</div>
                                    </div>
                                    <small className="text-muted">
                                        {date.toLocaleString()}
                                    </small>
                                </div>
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={() => {
                                        console.log("ping");
                                        clearNotification(notification.id);
                                    }}
                                >
                                    X
                                </Button>
                            </div>
                        </Dropdown.Item>
                    );
                });

                setNotifications(notificationCards);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleViewAll = () => {
        // Show a modal with all notifications
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            fetchNotifications(accessToken);
        }
    };


    return (
        <NotificationModal
            show={showModal}
            onHide={() => setShowModal(false)}
        />
    );
}

export default NotificationIcon;
