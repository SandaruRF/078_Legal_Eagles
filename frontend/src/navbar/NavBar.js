import { useState, useEffect,useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Navbar, Nav, Container } from "react-bootstrap";
import lightLogo from "../images/logo.png"; 
import darkLogo from "../images/dark-logo.png"; 
import { Link } from "react-router-dom";

export const NavBar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <Navbar expand="md" className={`${scrolled ? "scrolled" : ""} ${theme}`}>
            <Container>
                <Navbar.Brand href="/">
                    <img src={theme === "light" ? lightLogo : darkLogo} alt="Logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link className="navbar-link">
                            <Link to="/" style={{ all: "unset" }}>
                                Home
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="navbar-link">
                            <Link to="/chat" style={{ all: "unset" }}>
                                Chatbot
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="navbar-link">
                            <Link to="/comparator" style={{ all: "unset" }}>
                                Comparator
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="navbar-link">
                            <Link to="/prediction" style={{ all: "unset" }}>
                                Prediction
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="navbar-link">
                            <Link to="/news" style={{ all: "unset" }}>
                                News
                            </Link>
                        </Nav.Link>
                        <Nav.Link className="navbar-link">
                            <Link to="/about" style={{ all: "unset" }}>
                                About Us
                            </Link>
                        </Nav.Link>
                    </Nav>
                    {/* Toggle switch */}
                    <div className="theme-switch" onClick={toggleTheme}>
                        <div className={`switch ${theme === "dark" ? "dark" : "light"}`}>
                            <div className="switch-circle"></div>
                        </div>
                        <span className="theme-label">{theme === "light" ? "Light" : "Dark"}</span>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
