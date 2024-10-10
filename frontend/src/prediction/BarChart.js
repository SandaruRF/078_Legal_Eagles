import React, { useState, useEffect,useRef, useContext } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { NavBar } from "../navbar/NavBar";
import Footer from "../footer/Footer";
import "./BarChart.css";
import Compare from "./compareChart";
import { PredictButton } from "./PredictButton";
import { ThemeContext } from "../ThemeContext";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";



ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
); 

const BarChart = () => {
    const spacerRef=useRef(null);
    const [showCompareChart, setShowCompareChart] = useState(false);
    const { theme } = useContext(ThemeContext);


    const handleClick = () => {
        setShowCompareChart(true); 
        setTimeout(() => {
            if (spacerRef.current) {
                spacerRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);  
    };

    const [values, setValues] = useState({
        ranil: null,
        anura: null,
        sajith: null,
        namal: null,
        secondVoteName1: null,
        secondVoteVal1: null,
        secondVoteName2: null,
        secondVoteVal2: null,
    });

    useEffect(() => {
        const fetchValues = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/get-values"
                );
                setValues({
                    ranil: response.data.ranil,
                    anura: response.data.anura,
                    sajith: response.data.sajith,
                    namal: response.data.namal,
                    secondVoteName1: response.data.secondVoteName1,
                    secondVoteVal1: response.data.secondVoteVal1,
                    secondVoteName2: response.data.secondVoteName2,
                    secondVoteVal2: response.data.secondVoteVal2,
                });
            } catch (error) {
                console.error("Error fetching values", error);
            }
        };

        fetchValues();
    }, []);

    const colorMap = {
        "Ranil Wickremesinghe": "rgba(250, 176, 2, 1)",
        "Anura Kumara": "rgba(200, 13, 77, 1)",
        "Sajith Premadasa": "rgba(81, 163, 3, 1)",
        "Namal Rajapaksa": "rgba(130, 7, 43, 1)",
    };

    const borderColorMap = {
        "Ranil Wickremesinghe": "rgba(250, 176, 2, 1)",
        "Anura Kumara": "rgba(200, 13, 77, 1)",
        "Sajith Premadasa": "rgba(81, 163, 3, 1)",
        "Namal Rajapaksa": "rgba(130, 7, 43, 1)",
    };

    const votePercentages = [
        values.ranil,
        values.anura,
        values.sajith,
        values.namal,
    ];

    const data1 = {
        labels: [
            "Ranil Wickremesinghe",
            "Anura Kumara",
            "Sajith Premadasa",
            "Namal Rajapaksa",
        ],
        datasets: [
            {
                label: "Vote Percentage (%)",
                data: votePercentages,
                backgroundColor: [
                    colorMap["Ranil Wickremesinghe"],
                    colorMap["Anura Kumara"],
                    colorMap["Sajith Premadasa"],
                    colorMap["Namal Rajapaksa"],
                ],
                borderColor: [
                    borderColorMap["Ranil Wickremesinghe"],
                    borderColorMap["Anura Kumara"],
                    borderColorMap["Sajith Premadasa"],
                    borderColorMap["Namal Rajapaksa"],
                ],
                borderWidth: 1,
            },
        ],
    };
    const isMobile = window.innerWidth < 600;
    const options1 = {
        responsive: true,
        indexAxis: isMobile? "y" : "x",
        plugins: {
            title: {
                display: true,
                text: "Predicted Results",
                color: theme === "light" ? "black" : "white",
                font: {
                    size: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw}%`,
                },
            },
            legend: {
                display: false, 
            },
            datalabels: {
                display: true,
                color: theme === "light" ? "black" : "white",
                anchor: "center",
                align: "center",
                formatter: (value) => `${value}%`,
                font:{size:isMobile?10:15,weight: "bold",},
            },
        },
        scales: {
            y: isMobile?{
                ticks: {
                    color: theme === "light" ? "black" : "white",
                },
                grid: {
                    color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)", 
                },
            }:{
                beginAtZero: true,
                max: 50,
                ticks: {
                    callback: (value) => `${value}%`,
                    color: theme === "light" ? "black" : "white", 
                },
                grid: {
                    color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)", 
                },
            },
            x: isMobile?{
                beginAtZero: true,
                max: 50,
                ticks: {
                    callback: (value) => `${value}%`,
                    color: theme === "light" ? "black" : "white", 
                },
                grid: {
                    color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)", 
                },
            }:{
                ticks: {
                    color: theme === "light" ? "black" : "white",
                },
                grid: {
                    color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)", 
                },
            },
        },
    };

    const secondChartData = {
        labels: [values.secondVoteName1, values.secondVoteName2],
        datasets: [
            {
                label: "Final Vote Percentage (%)",
                data: [values.secondVoteVal1, values.secondVoteVal2],
                backgroundColor: [
                    colorMap[values.secondVoteName1],
                    colorMap[values.secondVoteName2],
                ],
                borderColor: [
                    borderColorMap[values.secondVoteName1],
                    borderColorMap[values.secondVoteName2],
                ],
                borderWidth: 1,
            },
        ],
    };

    const secondChartOptions = {
        responsive: true,
        indexAxis: "y",
        plugins: {
            title: {
                display: true,
                text: "Final Vote Predictions",
                color: theme === "light" ? "black" : "white",
                font: {
                    size: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw}%`,
                },
            },
            legend: {
                display: false,
            },
            datalabels: {
                display: true,
                color: theme === "light" ? "black" : "white", 
                anchor: "end",
                align: "top",
                formatter: (value) => `${value}%`,
                font:{size:isMobile?10:15,weight: "bold",},
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (value) => `${value}%`,
                    color: theme === "light" ? "black" : "white", 
                },
                grid: {
                    color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)", 
                },
            },
            y: {
                ticks: {
                    color: theme === "light" ? "black" : "white", 
                },
                grid: {
                    color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)", 
                },
            },
        },
    };

    const backgroundColor = theme === 'dark' ? '#212121' : 'white';

    return (
        <div style={{ backgroundColor }}>
            <NavBar />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    minHeight: "600px",
                    padding: "20px",
                    boxSizing: "border-box",
                    backgroundColor: theme === "light" ? "white" : "#212121", 
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "900px",
                        marginBottom: "60px",
                    }}
                >
                    <Bar data={data1} options={options1} />
                </div>

                {values.secondVoteVal1 !== null &&
                    values.secondVoteVal2 !== null && (
                    <div
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "900px",
                        }}
                    >
                        <div className="col-12">
                        <Card className={`text-center card-custom ${theme === "light" ? "card-light" : "card-dark"}`}>
                                <Card.Text className="card-text p-3">
                                    Our model predicts that no candidate has secured
                                    over 50% of the vote, making second and third
                                    preference votes crucial in determining the
                                    final outcome. By combining these predictions
                                    with survey data on second preferences, we
                                    present the final prediction for the 2024
                                    presidential election.
                                </Card.Text>
                            </Card>
                        </div>
                        <Bar
                            data={secondChartData}
                            options={secondChartOptions}
                        />
                    </div>

                    )}
            </div>
            {!showCompareChart && (<PredictButton onClick={handleClick} theme={theme} />)}
            {showCompareChart && (<Compare theme={theme} ref={spacerRef}/>)}
            <Footer theme={theme} />
        </div>
    );
};

export default BarChart;
