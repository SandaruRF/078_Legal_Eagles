import React, { useState } from "react";
import CardCandidate from "./CardCandidate";
import akdImage from "../images/akd.jpeg";
import rwImage from "../images/rw.jpg";
import nrImage from "../images/nr.jpg";
import spImage from "../images/sp.jpg";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Model from "./Model.js";

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
                    <a
                        href="#"
                        className="openModalBtn"
                        onClick={() =>
                            isCandidateAdded ? null : setOpenModal(true)
                        }
                        style={{
                            pointerEvents: isCandidateAdded ? "none" : "auto",
                            color: isCandidateAdded ? "gray" : "blue",
                        }} // Disable link when a candidate is added
                    >
                        {isCandidateAdded
                            ? `Remove ${candidateName} to add a new one`
                            : "Click here to add a new candidate"}
                    </a>
                    <br />
                    {openModal && (
                        <Model
                            closeModal={setOpenModal}
                            onFileUploaded={handleFileUploaded}
                        />
                    )}
                    <br></br>
                    {isCandidateAdded && uploadedFileName && candidateName && (
                        <div>
                            <p>
                                You have added <strong>{candidateName}</strong>{" "}
                                to compare.
                            </p>

                            <a
                                href="##"
                                onClick={() =>
                                    handleRemoveCandidate(candidateName)
                                }
                            >
                                Click here to remove{" "}
                                <strong>{candidateName}</strong>
                            </a>
                            <br></br>
                        </div>
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
