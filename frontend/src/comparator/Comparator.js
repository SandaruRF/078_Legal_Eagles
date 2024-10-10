import React, { useState, useEffect } from "react";
import CandidateList from "./CandidateList";
import Gallery from "./Gallery";
import CandidateDiv from "./Candidatediv";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import { NavBar } from "../navbar/NavBar";
import Footer from "../footer/Footer";

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
    const [summaryData, setSummaryData] = useState(null);
    const [checkedCandidates, setCheckedCandidates] = useState(
        Array(4).fill(false)
    );
    const [checkedImages, setCheckedImages] = useState(Array(12).fill(false));
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modalCandidates, setModalCandidates] = useState([]);
    const [isSmallScreen, setIsSmallScreen] = useState(
        window.innerWidth < 1200
    );

    const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 1200);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleCandidateSelection = (index) => {
        const newCheckedCandidates = [...checkedCandidates];
        newCheckedCandidates[index] = !newCheckedCandidates[index];
        setCheckedCandidates(newCheckedCandidates);
    };

    const selectedCandidates = checkedCandidates
        .map((isChecked, i) => isChecked && candidates[i])
        .filter(Boolean);

    console.log("Selected Candidates from list:", selectedCandidates);
    console.log("Selected Modal Candidates:", modalCandidates);

    const handleModalCandidateAdd = (candidate) => {
        setModalCandidates([...modalCandidates, candidate]);
        console.log("Modal Candidates after adding:", [
            ...modalCandidates,
            candidate,
        ]);
    };

    const handleModalCandidateRemove = (name) => {
        setModalCandidates(modalCandidates.filter((c) => c.name !== name));
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
        ranil: "#FED431",
        namal: "#87171A",
        sajith: "#0B7708",
    };

    const FullName = {
        anura: "Anura Kumara Dissanayake",
        ranil: "Ranil Wickramasinghe",
        namal: "Namal Rajapaksha",
        sajith: "Sajith Premadasa",
    };

    const handleSubmit = async () => {
        const selectedCandidates = checkedCandidates
            .map((isChecked, index) => isChecked && candidates[index])
            .filter(Boolean);

        const allCandidates = [
            ...selectedCandidates,
            ...modalCandidates.map((c) => c.name),
        ];
        const selectedFields = texts.filter((_, index) => checkedImages[index]);

        console.log(
            "Final selected candidates from checkboxes:",
            allCandidates
        );

        if (allCandidates.length < 2) {
            alert("Please select at least 2 candidates.");
            return;
        }

        if (selectedFields.length < 1) {
            alert("Please select at least 1 field.");
            return;
        }
        if (selectedFields.length > 4) {
            alert("Please select maximum 4.");
            return;
        }

        setFormSubmitted(true);
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedFields,
                    selectedCandidates: allCandidates,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Success:", data);

            const candidateData = data.data;
            const summaryData = data.summary;

            setCandidateData(candidateData);
            setSummaryData(summaryData);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
            setFormSubmitted(false);
        }
    };

    return (
        <div>
            <NavBar />
            <CandidateList
                checkedCandidates={checkedCandidates}
                onCandidateClick={handleCandidateSelection}
                onModalCandidateAdd={handleModalCandidateAdd}
                onModalCandidateRemove={handleModalCandidateRemove}
                modalCandidates={modalCandidates}
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
                        <Spinner
                            animation="border"
                            variant="info"
                            style={{ width: "5rem", height: "5rem" }}
                        />
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
                                        flexWrap: "wrap",
                                        justifyContent: "center",
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
                                                    "#000000"
                                                }
                                                fullName={
                                                    FullName[candidateName] ||
                                                    candidateName
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                            <Card
                                style={{
                                    width: "98%",
                                    textAlign: "left",
                                    height: "100%",
                                    margin: "0 1rem 1rem 1rem",
                                }}
                            >
                                <Card.Header
                                    style={{
                                        fontSize: "1.3rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Summary of {field}
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text style={{ textAlign: "justify" }}>
                                        {summaryData[field]}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Card>
                    ))}
                </div>
            ) : null}
            <Footer />
        </div>
    );
};

export default Comparator;
