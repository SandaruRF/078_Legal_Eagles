import React, { useState, useContext } from "react";
import CardCandidate from "./CardCandidate";
import akdImage from "../images/akd.jpeg";
import rwImage from "../images/rw.jpg";
import nrImage from "../images/nr.jpg";
import spImage from "../images/sp.jpg";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Model from "./Model.js";
import { ThemeContext } from "../ThemeContext";

const initialCandidates = [
    {
        image: akdImage,
        name: "Anura Kumara Dissanayake",
        party: "NPP",
        bgColor: "#c80d4d",
    },
    {
        image: rwImage,
        name: "Ranil Wickramasinghe",
        party: "",
        bgColor: "#fab002",
    },
    {
        image: nrImage,
        name: "Namal Rajapakshe",
        party: "SLPP",
        bgColor: "#82072b",
    },
    {
        image: spImage,
        name: "Sajith Premadasa",
        party: "SJP",
        bgColor: "#51a303",
    },
];

const CandidateList = ({
    checkedCandidates,
    onCandidateClick,
    onModalCandidateAdd,
    onModalCandidateRemove,
    modalCandidates,
}) => {
    const { theme } = useContext(ThemeContext);
    const [openModal, setOpenModal] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [isCandidateAdded, setIsCandidateAdded] = useState(false);

    const handleScroll = () => {
        window.location.href = "#topics";
    };

    const handleFileUploaded = (fileName, name) => {
        setUploadedFileName(fileName);
        setCandidateName(name);
        onModalCandidateAdd({ name, fileName });
        setIsCandidateAdded(true);
    };

    const handleRemoveCandidate = (name) => {
        onModalCandidateRemove(name);
        setIsCandidateAdded(false); // Set this to false when candidate is removed
        setCandidateName("");
    };

    return (
        <div className="candidate-list">
            <Card
                className="text-center"
                style={{
                    backgroundColor: theme === "dark" ? "#424242" : "#EEEEEE",
                    marginRight: "5rem",
                    marginLeft: "5rem",
                    marginTop: "3rem",
                }}
            >
                <Card.Body>
                    <br />
                    <Card.Title
                        style={{
                            fontSize: "1.7rem",
                            fontWeight: "bold",
                            color: theme === "dark" ? "white" : "black",
                        }}
                    >
                        Select Candidates to Compare
                    </Card.Title>
                    <Card.Text
                        style={{ color: theme === "dark" ? "white" : "black" }}
                    >
                        Select at least 2 candidates
                    </Card.Text>
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
                            {initialCandidates.map((candidate, index) => (
                                <CardCandidate
                                    key={index}
                                    image={candidate.image}
                                    name={candidate.name}
                                    party={candidate.party}
                                    bgColor={candidate.bgColor}
                                    isChecked={checkedCandidates[index]}
                                    onClick={() => onCandidateClick(index)}
                                />
                            ))}
                        </div>
                    </Card.Text>
                    <br />
                    <Card style={{ width: "60%", margin: "0 auto" }}>
                        <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <div
                                className="mb-3 mb-md-0"
                                style={{ fontWeight: "bold" }}
                            >
                                {isCandidateAdded
                                    ? `You have added ${candidateName} to compare.`
                                    : "Add a New Candidate"}
                            </div>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    isCandidateAdded
                                        ? handleRemoveCandidate(candidateName)
                                        : setOpenModal(true)
                                }
                                className="w-100 w-md-auto" // Ensures full width on small screens, adjusts on larger screens
                                style={{
                                    backgroundColor: isCandidateAdded
                                        ? "red"
                                        : "#387BDC",
                                    fontWeight: "bold",
                                    color: "white",
                                    maxWidth: "200px",
                                }}
                            >
                                {isCandidateAdded
                                    ? "Remove Candidate"
                                    : "Add New Candidate"}
                            </Button>
                        </Card.Body>
                    </Card>

                    {openModal && (
                        <Model
                            closeModal={() => setOpenModal(false)}
                            onFileUploaded={handleFileUploaded}
                        />
                    )}

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
