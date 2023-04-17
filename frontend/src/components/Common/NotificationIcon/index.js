import React, { useState, useEffect } from "react";
import { Bell, BellFill } from "react-bootstrap-icons";
import { Button, Dropdown } from "react-bootstrap";

function NotificationIcon() {
    const [hovered, setHovered] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const isLoggedIn = localStorage.getItem("access_token") !== null;

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Button
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
                            <div className="d-flex flex-column justify-content-between">
                                <div>
                                    <strong>{type}</strong>
                                    <div>{text}</div>
                                </div>
                                <small className="text-muted">{date.toLocaleString()}</small>
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

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "access_token") {
                const accessToken = e.newValue;

                if (accessToken) {
                    fetchNotifications(accessToken);
                } else {
                    setNotifications([]);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                {hovered ? <BellFill /> : <Bell />}
            </Dropdown.Toggle>
            {isLoggedIn && (
                <Dropdown.Menu>
                    {
                        notifications.length > 0 ? notifications :
                        <Dropdown.Item href="#">
                            No notifications
                        </Dropdown.Item>
                    }
                </Dropdown.Menu>
            )}
        </Dropdown>
    );
}

export default NotificationIcon;
