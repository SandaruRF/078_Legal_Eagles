import { NavBar } from "../navbar/NavBar";
import NewsCard from "./NewsCard";
import { Col, Row, Form, Pagination } from "react-bootstrap";
import React, { useEffect, useState, useContext } from "react";
import Card from "react-bootstrap/Card";
import Footer from "../footer/Footer";
import Spinner from "react-bootstrap/Spinner";
import { ThemeContext } from "../ThemeContext";
import "./News.css";

const News = () => {
    const { theme } = useContext(ThemeContext);
    const [newsData, setNewsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false); // Add error state
    const itemsPerPage = 8;

    // Fetch the news from backend
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(false); // Reset error state before fetching
                const response = await fetch("http://localhost:8000/news");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setNewsData(data);
            } catch (error) {
                console.error("Error fetching news:", error);
                setError(true); // Set error state on failure
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const maxPageButtons = 5; // Maximum number of buttons to display
    const halfPageButtons = Math.floor(maxPageButtons / 2);

    const getPaginationItems = () => {
        let items = [];
        let startPage, endPage;

        // Always show the first and last page
        if (totalPages <= maxPageButtons) {
            // If total pages are less than or equal to maxPageButtons, show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // Show first page
            items.push(
                <Pagination.Item
                    key={1}
                    active={1 === currentPage}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Pagination.Item>
            );

            // Calculate the range of pages to show
            if (currentPage <= halfPageButtons + 1) {
                // If near the beginning
                startPage = 2;
                endPage = Math.min(maxPageButtons - 1, totalPages - 1);
            } else if (currentPage + halfPageButtons >= totalPages) {
                // If near the end
                startPage = Math.max(totalPages - (maxPageButtons - 2), 2);
                endPage = totalPages - 1;
            } else {
                // Normal case
                startPage = currentPage - halfPageButtons;
                endPage = currentPage + halfPageButtons;
            }

            // Add middle page numbers
            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Pagination.Item>
                );

                // Add ellipses if needed
                if (i === endPage && i < totalPages - 1) {
                    items.push(<Pagination.Ellipsis key="ellipsis" />);
                }
            }

            // Always show the last page
            if (totalPages > 1) {
                items.push(
                    <Pagination.Item
                        key={totalPages}
                        active={totalPages === currentPage}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </Pagination.Item>
                );
            }
        }

        return items;
    };

    // Function to determine the color based on category
    const getBorderColor = (category) => {
        switch (category) {
            case "Education":
                return "darkgreen";
            case "Agriculture":
                return "#8bc34a";
            case "Economy":
                return "#ff9800";
            case "Science and Technology":
                return "#9c27b0";
            case "Environment":
                return "#4caf50";
            case "Social Empowerment":
                return "#03a9f4";
            case "Energy":
                return "darkcyan";
            case "Defence":
                return "#f44336";
            case "Tourism":
                return "#00bcd4";
            case "Private and Government Sectors":
                return "#795548";
            case "Foreign Relationships":
                return "#673ab7";
            case "Politics":
                return "#3f51b5";
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
        window.scrollTo(0, 0);
    };

    return (
        <div
            style={{
                backgroundColor: theme === "dark" ? "#212121" : "white",
            }}
        >
            <NavBar />
            <Card
                body
                style={{
                    backgroundColor: theme === "dark" ? "#323232" : "#EEEEEE",
                    color: theme === "dark" ? "white" : "black",
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
                        className={
                            theme === "dark"
                                ? "custom-placeholder-dark"
                                : "custom-placeholder-light"
                        }
                        type="text"
                        placeholder="Search by Category or News..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            backgroundColor:
                                theme === "dark" ? "#323232" : "#EEEEEE",
                            color: theme === "dark" ? "white" : "black",
                        }}
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
                        height: "100%",
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
                            color: theme === "dark" ? "white" : "black",
                            textAlign: "center",
                        }}
                    >
                        Please hold on... <br />
                        We are retrieving the latest updates for you.
                    </Card.Text>
                    <br />
                    <br />
                </Card.Body>
            ) : error ? ( // Show error message if there's an error
                <Card.Body
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Card.Text
                        style={{
                            fontSize: "1.5rem",
                            color: theme === "dark" ? "white" : "black",
                            textAlign: "center",
                        }}
                    >
                        Something went wrong. <br />
                        Please try again later.
                    </Card.Text>
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
                {getPaginationItems()}
                <Pagination.Next
                    onClick={() =>
                        handlePageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                />
            </Pagination>
            <Footer />
        </div>
    );
};

export default News;
