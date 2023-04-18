import React, { useEffect, useState } from "react";
import { Image, NavDropdown } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfileDropdown() {
    const { user } = useContext(AuthContext);
    const [username, setUsername] = useState(user ? user.username : "Profile");
    const [authenticated, setAuthenticated] = useState(
        localStorage.getItem("access_token") !== null
    );
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setAuthenticated(false);
        setUsername("Profile");

        // Redirect to the login page
        navigate("/login");
    };

    const handleManageProfile = () => {
        // Redirect to the login page
        //redirect("/manage-profile");
        navigate('/profile/edit');
    }

    const handleMyReservations = () => {
        // Redirect to the login page
        navigate("/reservation/details/list/");
    }

    const handleMyProperties = () => {
        // Redirect to the login page
        navigate( '/profile/properties');
    }

    const loggedInMenu = (
        <>
            <NavDropdown.Item onClick={handleManageProfile}>
                Manage Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleMyReservations}>
                My Reservations
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleMyProperties}>
                My Properties
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
                Log Out
            </NavDropdown.Item>
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
