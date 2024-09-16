import React from "react";

const CandidateDiv = ({ id, candidateData, bgColor }) => {
    return (
        <div
            style={{
                flex: 1,
                padding: "10px",
                backgroundColor: bgColor,
                margin: "10px",
                height: "200px",
                fontWeight: "bolder",
                borderRadius: "5px",
            }}
        >
            {Object.entries(candidateData).map(([field, details], index) => (
                <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: details }}
                    style={{ marginBottom: "10px" }}
                />
            ))}
        </div>
    );
};

export default CandidateDiv;
