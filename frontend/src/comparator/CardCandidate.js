import React, { useState } from "react";
import Card from "react-bootstrap/Card";

const CardCandidate = ({
    key,
    image,
    name,
    party,
    bgColor,
    isChecked,
    onClick,
}) => {
    return (
        <>
            <Card
                onClick={onClick}
                style={{
                    width: "15rem",
                    border: isChecked
                        ? "3.5px solid blue"
                        : "1px solid lightgray",
                    cursor: "pointer",
                    boxShadow: isChecked
                        ? "0px 0px 10px rgba(0, 0, 255, 0.5)"
                        : "none",
                    backgroundColor: bgColor || "white",
                }}
            >
                <Card.Img
                    variant="top"
                    src={image}
                    style={{
                        width: "94.5%",
                        height: "200px",
                        objectFit: "cover",
                        marginTop: "0.5rem",
                        marginRight: "0.47rem",
                        marginLeft: "0.47rem",
                        marginBottom: "0",
                    }}
                />
                <Card.Body>
                    <Card.Title style={{ color: "white" }}>{name}</Card.Title>
                    <Card.Text style={{ color: "white", fontSize: "14px" }}>
                        {party}
                    </Card.Text>
                </Card.Body>

                <input
                    type="checkbox"
                    style={{ display: "none" }}
                    checked={isChecked}
                    readOnly
                />
            </Card>
        </>
    );
};

export default CardCandidate;
