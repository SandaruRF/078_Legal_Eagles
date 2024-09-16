import React from "react";
import Card from "react-bootstrap/Card";

const CandidateDiv = ({ id, candidateData, bgColor, fullName }) => {
    return (
        <div
            style={{
                flex: 1,
                padding: "10px",
                backgroundColor: bgColor,
                margin: "10px",
                height: "auto",
                fontWeight: "bolder",
                borderRadius: "5px",
            }}
        >
            {Object.entries(candidateData).map(([field, details], index) => (
                <Card
                    style={{
                        width: "100%",
                        textAlign: "left",
                    }}
                    key={index}
                >
                    <Card.Body>
                        <Card.Title
                            style={{ color: bgColor, fontSize: "1.5rem" }}
                        >
                            {fullName}
                        </Card.Title>
                        <hr />
                        <Card.Text>
                            <div
                                key={index}
                                dangerouslySetInnerHTML={{ __html: details }}
                                style={{ marginBottom: "10px" }}
                            />
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default CandidateDiv;
