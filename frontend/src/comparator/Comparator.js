import React, { useState } from "react";
import CandidateList from "./CandidateList";
import Gallery from "./Gallery";

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

const Compare = () => {
    const [checkedCandidates, setCheckedCandidates] = useState(
        Array(4).fill(false)
    );
    const [checkedImages, setCheckedImages] = useState(Array(12).fill(false));

    const handleCandidateSelection = (index) => {
        const newCheckedCandidates = [...checkedCandidates];
        newCheckedCandidates[index] = !newCheckedCandidates[index];
        setCheckedCandidates(newCheckedCandidates);
    };

    const handleTopicSelection = (newCheckedImages) => {
        setCheckedImages(newCheckedImages);
    };

    const handleSubmit = async () => {
        const selectedCandidates = checkedCandidates
            .map((isChecked, index) => isChecked && candidates[index])
            .filter(Boolean);

        const selectedFields = texts.filter((_, index) => checkedImages[index]);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/endpoint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ selectedCandidates, selectedFields }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Success:", data);
        } catch (error) {
            console.error("Error:", error);
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
        </div>
    );
};

export default Compare;
