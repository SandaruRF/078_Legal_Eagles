import roshana from "../images/roshana.jpeg";
import sandaru from "../images/sandaru.jpeg";
import nadil from "../images/nadil.jpg";
import seniru from "../images/seniru.jpeg";
import sehara from "../images/sehara.jpeg";
import Aboutcard from "./Aboutcard";
import { NavBar } from "../navbar/NavBar";
import Card from "react-bootstrap/Card";
import Footer from "../footer/Footer";
import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Aboutus = () => {
    const members = [
        {
            name: "Sandaru Fernando",
            image: sandaru,
            linkedin: "https://www.linkedin.com/in/sandarurf/",
        },
        {
            name: "Seniru Epasinghe",
            image: seniru,
            linkedin: "https://www.linkedin.com/in/seniru-epasinghe-b34b86232/",
        },
        {
            name: "Roshana Isuranga",
            image: roshana,
            linkedin: "https://www.linkedin.com/in/helapallakori/",
        },
        {
            name: "Nadil Siriwardhana",
            image: nadil,
            linkedin:
                "https://www.linkedin.com/in/nadil-siriwardhana-b8566526a/",
        },
        {
            name: "Sehara Arunodya",
            image: sehara,
            linkedin: "https://www.linkedin.com/in/sehara-arunodya-33279321b/",
        },
    ];
    const { theme } = useContext(ThemeContext);

    return (
        <div
            style={{ backgroundColor: theme === "dark" ? "#212121" : "white" }}
        >
            <NavBar />
            <Card
                className="text-center"
                style={{
                    backgroundColor: theme === "dark" ? "#303030" : "#EEEEEE",
                    color: theme === "dark" ? "white" : "black",
                    marginRight: "auto",
                    marginLeft: "auto",
                    marginTop: "3rem",
                    marginBottom: "3rem",
                    width: "75%",
                }}
            >
                <Card.Body>
                    <br></br>
                    <Card.Title
                        style={{ fontSize: "1.7rem", fontWeight: "bold" }}
                    >
                        Legal Eagles : Our Team
                    </Card.Title>
                    <br></br>
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {members.map((member, index) => (
                            <Aboutcard
                                name={member.name}
                                image={member.image}
                                linkedin={member.linkedin}
                            />
                        ))}
                    </div>
                    <br></br>
                </Card.Body>
            </Card>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Footer />
        </div>
    );
};

export default Aboutus;
