import Accordion from "react-bootstrap/Accordion";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

const NewsCard = ({ border, image, title, category, link }) => {
    const [isAccordionOpen, setAccordionOpen] = useState(false);
    const [comparisonResult, setComparisonResult] = useState(null); // State to hold comparison result
    const [loading, setLoading] = useState(false); // State to manage loading

    const handleAccordionToggle = async () => {
        setAccordionOpen(!isAccordionOpen);

        // Process comparison if the category is not Politics
        if (!isAccordionOpen && category !== "Politics") {
            setLoading(true); // Set loading to true

            try {
                const response = await fetch(
                    "http://localhost:8000/api/newscomp",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ title, category }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setComparisonResult(data); // Store the response data
            } catch (error) {
                console.error("Error during comparison:", error);
            } finally {
                setLoading(false); // Set loading to false
            }
        }
    };

    // Helper function to convert hex color to rgba with opacity
    const hexToRgba = (hex, opacity) => {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    return (
        <Card
            style={{
                backgroundColor: "#EEEEEE",
                border: `1.9px solid ${border}`,
                borderRadius: "5px",
                margin: "0.5rem 0",
                maxWidth: "100%",
                height: "auto",
                boxShadow: `0px 4px 8px ${hexToRgba(border, 0.5)}`,
            }}
        >
            <div
                className="d-flex flex-wrap align-items-center"
                style={{ padding: "0.5rem 1rem" }}
            >
                <Card.Img
                    variant="top"
                    src={image}
                    style={{
                        width: "100%",
                        maxWidth: "150px",
                        height: "120px",
                        objectFit: "cover",
                        marginRight: "1rem",
                    }}
                />
                <Card.Body
                    style={{
                        flex: "1 1 0",
                        minWidth: "250px",
                        overflow: "hidden",
                    }}
                >
                    <Card.Title>{title}</Card.Title>
                    <Card.Text
                        style={{
                            textAlign: "left",
                            wordWrap: "break-word",
                        }}
                    >
                        <span
                            style={{
                                color: border,
                                fontWeight: "bold",
                            }}
                        >
                            {category}
                        </span>
                    </Card.Text>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary">
                            Read More on Ada Derana
                        </Button>
                    </a>
                </Card.Body>
            </div>

            <Accordion defaultActiveKey={null} style={{ margin: "1rem" }}>
                <Accordion.Item
                    eventKey="0"
                    style={{ border: "1px solid #008000" }}
                >
                    <Accordion.Header onClick={handleAccordionToggle}>
                        <span style={{ fontWeight: "bold" }}>
                            Compare with Manifesto
                        </span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {category === "Politics" &&
                            "Comparing news related to Politics with a Manifesto isn't applicable."}
                        {category !== "Politics" && (
                            <>
                                {loading ? (
                                    <>
                                        <Spinner
                                            animation="border"
                                            variant="info"
                                        />
                                        <Card.Title
                                            style={{
                                                fontSize: "1.3rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Comparing
                                        </Card.Title>
                                    </>
                                ) : (
                                    <div>
                                        {comparisonResult ? (
                                            <p
                                                style={{
                                                    textAlign: "justify",
                                                    fontSize: "120%",
                                                }}
                                            >
                                                {comparisonResult.data}
                                            </p>
                                        ) : (
                                            <p>
                                                No comparison result available.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Card>
    );
};

export default NewsCard;
