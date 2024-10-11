import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import { ThemeContext } from "../ThemeContext";

const CandidateDiv = ({ id, candidateData, bgColor, fullName }) => {
    const { theme } = useContext(ThemeContext);
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
                        height: "100%",
                        backgroundColor: theme === "dark" ? "#323232" : "white",
                        color: theme === "dark" ? "white" : "black",
                    }}
                    key={index}
                >
                    <Card.Body>
                        <Card.Title
                            style={{
                                color: bgColor,
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                            }}
                        >
                            {fullName}
                        </Card.Title>
                        <hr />
                        <Card.Text style={{ textAlign: "left" }}>
                            <div
                                key={index}
                                dangerouslySetInnerHTML={{ __html: details }}
                                style={{
                                    marginBottom: "10px",
                                    paddingLeft: "12px",
                                }}
                            />
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default CandidateDiv;
