import React, { useEffect, useState } from "react";
import { Image, NavDropdown } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

function ProfileDropdown() {
    const { user } = useContext(AuthContext);
    const [username, setUsername] = useState(user ? user.username : "Profile");
    const [authenticated, setAuthenticated] = useState(
        localStorage.getItem("access_token") !== null
    );

    // Handle the signal from the login page
    window.addEventListener("newLogin", () => {
        // Update the username
        fetchUsername();

        // Update the authentication status
        setAuthenticated(true);
    });

    function fetchUsername() {
        // Get the access token from localStorage
        const accessToken = localStorage.getItem("access_token");

        // Get the user's username from the API
        fetch("http://localhost:8000/accounts/edit/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((response) => {
            if (response.status !== 200) {
                console.error("Failed to fetch user");
                return;
            }
            return response.json();
        }).then((data) => {
            if (!data) {
                return;
            }
            setUsername(data.username);
        });
    }

    useEffect(() => {

        if (authenticated) {
            fetchUsername();
        } else {
            setUsername("Profile");
        }
    }, [authenticated, user]);

    const handleManageProfileClick = () => {
        window.location.href = '/profile/edit';
      };

    const loggedInMenu = (
        <>
            <NavDropdown.Item onClick={handleManageProfileClick}>
                Manage Profile
            </NavDropdown.Item>
            <NavDropdown.Item>
                My Reservations
            </NavDropdown.Item>
            <NavDropdown.Item>
                My Properties
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>Log Out</NavDropdown.Item>
        </>
    );

    const loggedOutMenu = (
        <>
            <NavDropdown.Item>Log In</NavDropdown.Item>
        </>
    );

    return (
        <>
            <Image
                className="ms-2"
                src="https://via.placeholder.com/50"
                roundedCircle
            />
            <NavDropdown
                className="ms-2 text-bg-primary"
                title={username}
                id="profile-dropdown"
            >
                {authenticated ? loggedInMenu : loggedOutMenu}
            </NavDropdown>
        </>
    );
}


export default ProfileDropdown;
