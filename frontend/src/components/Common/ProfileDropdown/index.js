import React, {useEffect, useState} from "react";
import { Image, NavDropdown } from "react-bootstrap";
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

function ProfileDropdown() {
    const { user } = useContext(AuthContext);
    const [username, setUsername] = useState(user ? user.username : "Profile");

    useEffect(() => {
        setUsername(user ? user.username : "Profile");

        console.log(user);
    }, [user]);

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
