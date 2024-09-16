import React, { useState, useEffect } from "react";
import CandidateList from "./CandidateList";
import Gallery from "./Gallery";
import CandidateDiv from "./Candidatediv";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

const texts = [
    "Economy",
    "Health",
    "Education",
    "Energy",
    "Transport",
    "Agriculture",
    "Tourism",
    "Defense",
    "Science and Technology",
    "Social Empowerment",
    "Private and Government sectors",
    "Environment",
];

const candidates = ["anura", "ranil", "namal", "sajith"];

const Comparator = () => {
    const [candidateData, setCandidateData] = useState(null);
    const [checkedCandidates, setCheckedCandidates] = useState(
        Array(4).fill(false)
    );
    const [checkedImages, setCheckedImages] = useState(Array(12).fill(false));
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleCandidateSelection = (index) => {
        const newCheckedCandidates = [...checkedCandidates];
        newCheckedCandidates[index] = !newCheckedCandidates[index];
        setCheckedCandidates(newCheckedCandidates);
    };

    const handleTopicSelection = (newCheckedImages) => {
        setCheckedImages(newCheckedImages);
    };

    useEffect(() => {
        if (formSubmitted) {
            const comp_load = document.getElementById("comp_load");
            if (comp_load) {
                comp_load.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [formSubmitted]);

    useEffect(() => {
        if (candidateData) {
            const targetElement = document.getElementById("comp");
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [candidateData]);

    const [loading, setLoading] = useState(false);

    const colorMap = {
        anura: "#C4094A",
        ranil: "#0B7708",
        namal: "#87171A",
        sajith: "#FED431",
    };

    const FullName = {
        anura: "Anura Kumara Dissanayake",
        ranil: "Ranil Wickramasinghe",
        namal: "Namal Rajapaksha",
        sajith: "Sajith Premadasa",
    };

    const handleSubmit = async () => {
        setFormSubmitted(true);

        const selectedCandidates = checkedCandidates
            .map((isChecked, index) => isChecked && candidates[index])
            .filter(Boolean);

        const selectedFields = texts.filter((_, index) => checkedImages[index]);

        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/endpoint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedFields, selectedCandidates }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Success:", data);

            const candidateData = data.data;
            setCandidateData(candidateData);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <CandidateList
                checkedCandidates={checkedCandidates}
                onCandidateClick={handleCandidateSelection}
            />
            <Gallery
                checkedImages={checkedImages}
                onTopicChange={handleTopicSelection}
                onSubmit={handleSubmit}
            />
            {loading ? (
                <div
                    id="comp_load"
                    style={{ textAlign: "center", marginTop: "20px" }}
                >
                    <Card
                        body
                        className="text-center"
                        style={{
                            backgroundColor: "#EEEEEE",
                            marginRight: "5rem",
                            marginLeft: "5rem",
                            marginTop: "3rem",
                            marginBottom: "3rem",
                        }}
                    >
                        <Spinner animation="border" variant="info" />
                        <Card.Title
                            style={{
                                fontSize: "1.7rem",
                                fontWeight: "bold",
                            }}
                        >
                            Comparing
                        </Card.Title>
                    </Card>
                </div>
            ) : candidateData ? (
                <div id="comp" style={{ marginTop: "20px" }}>
                    <Card
                        body
                        className="text-center"
                        style={{
                            backgroundColor: "#EEEEEE",
                            marginRight: "5rem",
                            marginLeft: "5rem",
                            marginTop: "3rem",
                            marginBottom: "3rem",
                        }}
                    >
                        <Card.Title
                            style={{
                                fontSize: "1.7rem",
                                fontWeight: "bold",
                            }}
                        >
                            Comparator Results
                        </Card.Title>
                    </Card>
                    {Object.keys(
                        candidateData[Object.keys(candidateData)[0]]
                    ).map((field, fieldIndex) => (
                        <Card
                            className="text-center"
                            style={{
                                backgroundColor: "#EEEEEE",
                                marginRight: "5rem",
                                marginLeft: "5rem",
                                marginTop: "3rem",
                            }}
                            key={fieldIndex}
                        >
                            <div style={{ marginBottom: "20px" }}>
                                <br />
                                <Card.Title
                                    style={{
                                        fontSize: "1.7rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {field}
                                </Card.Title>
                                <br />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {Object.entries(candidateData).map(
                                        (
                                            [candidateName, candidateFields],
                                            index
                                        ) => (
                                            <CandidateDiv
                                                key={index}
                                                id={index}
                                                candidateData={{
                                                    [field]:
                                                        candidateFields[field],
                                                }}
                                                bgColor={
                                                    colorMap[candidateName] ||
                                                    "#FFFFFF"
                                                }
                                                fullName={
                                                    FullName[candidateName]
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                            
                        </Card>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default Comparator;
