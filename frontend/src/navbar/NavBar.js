import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

export const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} alt="Logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link className="navbar-link">
                            <Link to={"/"} style={{ all: "unset" }}>
                                Predictor
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="navbar-link">Chatbot</Nav.Link>
                        <Nav.Link className="navbar-link">
                            <Link to={"/comparator"} style={{ all: "unset" }}>
                                Comparator
                            </Link>
                        </Nav.Link>
                    </Nav>
                    <span className="navbar-text">
                        <a href="#footer">
                            <button className="vvd">
                                <span>Legal Eagles</span>
                            </button>
                        </a>
                    </span>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
