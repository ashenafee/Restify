import React, { useState } from "react";
import { Bell, BellFill } from "react-bootstrap-icons";
import {Dropdown, NavDropdown} from "react-bootstrap";


function NotificationIcon() {
    const [hovered, setHovered] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const handleNotificationClick = () => {
        // Grab the currently authenticated user's token from local storage
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        // Send a request to the Django server to retrieve the notifications for the currently authenticated user
        fetch('http://localhost:8000/notifications/list/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })
            .then(response => {
                // If the response is not 200, then the token is invalid and we need to refresh it
                if (response.status !== 200) {
                    return fetch('http://localhost:8000/api/token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            refresh: refreshToken,
                        })
                    })
                        .then(response => {
                            // If the response is not 200, then the refresh token is invalid and we need to log the user out
                            if (response.status !== 200) {
                                localStorage.removeItem("access_token");
                                localStorage.removeItem("refresh_token");
                                window.location.href = "/login";
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Save the new access token in local storage
                            localStorage.setItem("access_token", data.access);
                            return data.access;
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
                return response.json();
            })
            .then(data => {
                // Handle the retrieved notifications data

                // Store the amount of notifications
                const notificationCount = data.count;

                // For each notification, create a new notification card
                var results = data.results;
                const notificationCards = results.map(notification => {
                    var date = new Date(notification.date);
                    var text = notification.text;
                    var type = notification.type;

                    // Decide the title based on the type
                    if (type === "notification") {
                        type = "Notification";
                    } // TODO: Add more types

                    // Create the notification card
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

                // After the for loop
                setNotifications(notificationCards);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <NavDropdown title={hovered ? <BellFill /> : <Bell />} id="basic-nav-dropdown" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={handleNotificationClick}>
            {notifications}
        </NavDropdown>
    );

}

export default NotificationIcon;
