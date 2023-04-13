import {Button, Container, Image, Navbar, NavDropdown} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {Bell} from "react-bootstrap-icons";

function App() {
    return (
        <Navbar bg="primary" className="w-100">
            <Container className="justify-content-between w-100">
                <Navbar.Brand className="text-bg-primary" href="#home">Restify</Navbar.Brand>

                <div className="d-flex flex-row align-items-center">
                    <Bell className="text-bg-primary"></Bell>
                    <Button variant="outline-light" className="ms-2 py-3">My Rental Units</Button>

                    {/* Profile Dropdown */}
                    <Image className="ms-2" src="https://via.placeholder.com/50" roundedCircle />

                    <NavDropdown className="ms-2 text-bg-primary" title="Profile" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#">Manage Profile</NavDropdown.Item>
                        <NavDropdown.Item href="#">My Reservations</NavDropdown.Item>
                        <NavDropdown.Item href="#">My Properties</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#">Log Out</NavDropdown.Item>
                    </NavDropdown>
                </div>
            </Container>
        </Navbar>
    );
}

export default App;