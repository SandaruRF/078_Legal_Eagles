import React from "react";
import CardCandidate from "./CardCandidate";
import akdImage from "../images/akd.jpeg";
import rwImage from "../images/rw.jpg";
import nrImage from "../images/nr.jpg";
import spImage from "../images/sp.jpg";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const candidates = [
    {
        image: akdImage,
        name: "Anura Kumara Dissanayake",
        party: "NPP",
        bgColor: "#C4094A",
    },
    {
        image: rwImage,
        name: "Ranil Wickramasinghe",
        party: "",
        bgColor: "#0B7708",
    },
    {
        image: nrImage,
        name: "Namal Rajapakshe",
        party: "SLPP",
        bgColor: "#87171A",
    },
    {
        image: spImage,
        name: "Sajith Premadasa",
        party: "SJP",
        bgColor: "#FED431",
    },
];

const CandidateList = () => {
    const handleScroll = () => {
        window.location.href = "#topics";
    };

    return (
        <div class="candidate-list">
            <Card
                className="text-center"
                style={{
                    backgroundColor: "#EEEEEE",
                    marginRight: "5rem",
                    marginLeft: "5rem",
                    marginTop: "3rem",
                }}
            >
                <Card.Body>
                    <br />
                    <Card.Title
                        style={{ fontSize: "1.7rem", fontWeight: "bold" }}
                    >
                        Select Candidates to Compare
                    </Card.Title>
                    <Card.Text>Select at least 2 candidates</Card.Text>
                    <br />
                    <Card.Text>
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            {candidates.map((candidate, index) => (
                                <CardCandidate
                                    key={index}
                                    image={candidate.image}
                                    name={candidate.name}
                                    party={candidate.party}
                                    bgColor={candidate.bgColor}
                                />
                            ))}
                        </div>
                    </Card.Text>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleScroll}
                        style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    >
                        Next Step
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CandidateList;
