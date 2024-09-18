import roshana from "../images/roshana.jpeg";
import sandaru from "../images/sandaru.jpeg";
import nadil from "../images/nadil.jpg";
import seniru from "../images/seniru.jpeg";
import sehara from "../images/sehara.jpeg";
import Aboutcard from "./Aboutcard";
import { NavBar } from "../navbar/NavBar";
import Card from "react-bootstrap/Card";
import Footer from "../footer/Footer";

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

    return (
        <div>
            <NavBar />
            <Card
                className="text-center"
                style={{
                    backgroundColor: "#EEEEEE",
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
