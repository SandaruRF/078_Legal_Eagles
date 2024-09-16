import React, { useState } from "react";
import CandidateList from "./CandidateList";
import Gallery from "./Gallery";
import CandidateDiv from "./Candidatediv";
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
    const [candidateData, setCandidateData] = useState(null);
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

    const colorMap = {
        "anura": "#F28C8C",  // Light Red
        "ranil": "#FFF08F",      // Light Yellow
        "namal": "#D3A5D5",          // Light Purple
        "sajith": "#B6E5A1",          // Light Green
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
                body: JSON.stringify({ selectedFields ,selectedCandidates}),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Success:", data);

            const candidateData = data.data;
            setCandidateData(data.data);
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
            {candidateData && (
  <div style={{ marginTop: '20px' }}>
    {Object.keys(candidateData[Object.keys(candidateData)[0]]).map((field, fieldIndex) => (
      <div key={fieldIndex} style={{ marginBottom: '20px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{field}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {Object.entries(candidateData).map(([candidateName, candidateFields], index) => (
            <CandidateDiv
                key={index} // `key` prop for React's rendering
                id={index} 
              candidateData={{ [field]: candidateFields[field] }}
              bgColor={colorMap[candidateName] || '#FFFFFF'}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)}
        </div>
    );
};

export default Compare;
