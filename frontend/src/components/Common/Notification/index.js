import React, {useState} from "react";
import { Dropdown, Button } from "react-bootstrap";
import { Backspace, BackspaceFill} from "react-bootstrap-icons";

function Notification({ notification, onDelete }) {
    const { id, type, text, date } = notification;

    const [hovered, setHovered] = useState(false);

    const clearNotification = (notif_id) => {
        const accessToken = localStorage.getItem("access_token");
        fetch("http://localhost:8000/notifications/clear/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ notif_id }),
        })
            .then((response) => {
                if (response.status !== 200) {
                    console.error("Failed to clear notification");
                    return;
                }
                onDelete(notif_id);
                console.log("Notification cleared successfully");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Dropdown.Item className={"mb-0"}>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="d-flex flex-column justify-content-between">
                    <div>
                        <strong>{type}</strong>
                        <div>{text}</div>
                    </div>
                    <small className="text-muted">{new Date(date).toLocaleString()}</small>
                </div>
                {
                    hovered ?
                        <BackspaceFill
                            onClick={() => {
                                clearNotification(id);
                            }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        />
                        :
                        <Backspace
                            onClick={() => {
                                clearNotification(id);
                            }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        />
                }
            </div>
        </Dropdown.Item>
    );
}

export default Notification;
