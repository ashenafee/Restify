import React, { useState } from "react";
import NotificationModal from "../NotificationModal";

function NotificationIcon() {
    const [showModal, setShowModal] = useState(false);

    return (
        <NotificationModal
            show={showModal}
            onHide={() => setShowModal(false)}
        />
    );
}

export default NotificationIcon;
