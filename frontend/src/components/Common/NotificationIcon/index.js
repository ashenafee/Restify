import React, { useState } from "react";
import { Bell, BellFill } from "react-bootstrap-icons";

function NotificationIcon() {
    const [hovered, setHovered] = useState(false);

    const handleNotificationClick = () => {
        // Send a request to the Django server to retrieve the notifications for the currently authenticated user
        fetch('http://localhost:8000/notifications/list')
            .then(response => response.json())
            .then(data => {
                // Handle the retrieved notifications data
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return hovered ? (
        <BellFill
            className="text-bg-primary"
            onClick={handleNotificationClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        />
    ) : (
        <Bell
            className="text-bg-primary"
            onClick={handleNotificationClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        />
    );
}

export default NotificationIcon;
