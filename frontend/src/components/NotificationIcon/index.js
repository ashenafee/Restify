import React, { useState } from "react";
import { Bell, BellFill } from "react-bootstrap-icons";

function NotificationIcon() {
    const [hovered, setHovered] = useState(false);

    return hovered ? (
        <BellFill
            className="text-bg-primary"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        />
    ) : (
        <Bell
            className="text-bg-primary"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        />
    );
}

export default NotificationIcon;
