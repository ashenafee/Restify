import React, { useState, useEffect } from "react";
import { Image, NavDropdown } from "react-bootstrap";


function ProfileDropdown() {

    const [user, setUser] = useState(null);
    const fetchUser = async (accessToken) => {
        try {
            const response = await fetch("http://localhost:8000/accounts/edit/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {

                // Remove the invalid access token from local storage
                localStorage.removeItem("access_token");

                // Refresh the access token
                const refreshToken = localStorage.getItem("refresh_token");
                const response = await fetch("http://localhost:8000/api/token/refresh/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        refresh: refreshToken
                    })
                });

                // If the refresh token is invalid, log the user out
                if (response.status === 200) {
                    const data = await response.json();
                    localStorage.setItem("access_token", data.access);
                    await fetchUser(data.access);
                }

                setUser(null);
            }
        } catch (error) {
            console.error(error);
            setUser(null);
        }
    };


    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            fetchUser(accessToken);
        } else {
            setUser(null);
        }
    }, []);

    const loggedInMenu = (
        <>
            <NavDropdown.Item href="#">Manage Profile</NavDropdown.Item>
            <NavDropdown.Item href="#">My Reservations</NavDropdown.Item>
            <NavDropdown.Item href="#">My Properties</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Log Out</NavDropdown.Item>
        </>
    );

    const loggedOutMenu = (
        <>
            <NavDropdown.Item>Log In</NavDropdown.Item>
        </>
    );

    return (
        <>
            <Image className="ms-2" src="https://via.placeholder.com/50" roundedCircle />
            <NavDropdown
                className="ms-2 text-bg-primary"
                title={user ? user.username : "Profile"}
                id="basic-nav-dropdown"
            >
                {user ? loggedInMenu : loggedOutMenu}
            </NavDropdown>
        </>
    );

}

export default ProfileDropdown;
