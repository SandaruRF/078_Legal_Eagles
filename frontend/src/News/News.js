import { NavBar } from "../navbar/NavBar";
import NewsCard from "./NewsCard";
import { Col, Row, Form, Pagination } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Footer from "../footer/Footer";
import Spinner from "react-bootstrap/Spinner";

const News = () => {
    const [newsData, setNewsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 8; // Change this value to adjust the number of items per page

    // Fetch the news from backend
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8000/news");
                const data = await response.json();
                setNewsData(data);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Function to determine the color based on category
    const getBorderColor = (category) => {
        switch (category) {
            case "Education":
                return "darkgreen"; // Green
            case "Agriculture":
                return "#8bc34a"; // Light Green
            case "Economy":
                return "#ff9800"; // Orange
            case "Science and Technology":
                return "#9c27b0"; // Purple
            case "Environment":
                return "#4caf50"; // Green
            case "Social Empowerment":
                return "#03a9f4"; // Light Blue
            case "Energy":
                return "darkcyan";
            case "Defence":
                return "#f44336"; // Red
            case "Tourism":
                return "#00bcd4"; // Cyan
            case "Private and Government Sectors":
                return "#795548"; // Brown
            case "Foreign Relationships":
                return "#673ab7"; // Deep Purple
            case "Politics":
                return "#3f51b5"; // Indigo
            case "Transport":
                return "#2a2a4f";
            case "Health":
                return "#000000";
            default:
                return "#9e9e9e"; // Grey as default
        }
    };

    // Filter news based on search query
    const filteredNews = newsData.filter(
        (news) =>
            news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            news.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total pages
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

    // Get current items for the current page
    const currentItems = filteredNews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    return (
        <>
            <NavBar />
            <Card
                body
                style={{
                    backgroundColor: "#EEEEEE",
                    color: "black",
                    fontWeight: "bold",
                    margin: "1rem 4rem",
                    fontSize: "120%",
                }}
            >
                Post-Election Review: News, Vote Value, and Comparing Actions
                with Manifesto
            </Card>
            <Form style={{ margin: "1rem" }}>
                <Form.Group controlId="search" style={{ margin: "0 3rem" }}>
                    <Form.Control
                        type="text"
                        placeholder="Search by Category or News..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
            </Form>
            {loading ? (
                <Card.Body
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%", // Ensure it takes full height of the card body
                        margin: "0 auto",
                    }}
                >
                    <br />
                    <br />
                    <Spinner
                        animation="grow"
                        variant="primary"
                        style={{ width: "4rem", height: "4rem" }}
                    />
                    <Card.Text
                        style={{
                            marginTop: "15px",
                            fontSize: "1.2rem",
                            color: "#000000",
                            textAlign: "center", // Ensures the text is also centered
                        }}
                    >
                        Please hold on... <br />
                        We are retrieving the latest updates for you.
                    </Card.Text>
                    <br />
                    <br />
                </Card.Body>
            ) : (
                <Row g={1} style={{ margin: "0 3rem" }}>
                    {currentItems.map((news, index) => (
                        <Col md={6} key={index}>
                            <NewsCard
                                border={getBorderColor(news.category)}
                                image={news.image_url}
                                title={news.title}
                                category={news.category}
                                link={news.link}
                                // Pass a unique identifier for each card based on its index and page
                                key={`news-${currentPage}-${index}`}
                            />
                        </Col>
                    ))}
                </Row>
            )}
            <Pagination style={{ justifyContent: "center", margin: "1rem" }}>
                <Pagination.Prev
                    onClick={() =>
                        handlePageChange(Math.max(currentPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() =>
                        handlePageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                />
            </Pagination>
            <Footer />
        </>
    );
};

export default News;
