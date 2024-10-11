import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { ThemeContext } from "../ThemeContext";
import {
    Chart as ChartJS,
    CategoryScale, // Import the category scale
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import districtData from "./../data/electioin_data.json";
import { color } from "chart.js/helpers";

// Register the components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Chart = ({ districtName, buttonName }) => {
    const { theme } = useContext(ThemeContext);
    //console.log(buttonName);
    const colors = [];
    let names = [];
    let chartData = [];

    if (!districtName) {
        const data = {
            labels: [
                "Anura Kumara Dissanayake'",
                "Sajith Premadasa",
                "Ranil Wickremesinghe",
                "Namal Rajapaksa",
                "Other",
            ], // X-axis labels
            datasets: [
                {
                    label: "Votes", // Chart label
                    data: [5634915, 4363035, 2299767, 342781, 679118], // Y-axis data points
                    backgroundColor: [
                        "#c80d4d",
                        "#51a303",
                        "#fab002",
                        "#82072b",
                        "#ababb3",
                    ],
                    borderRadius: 10,
                },
            ],
        };

        //console.log(data.lables);

        const options = {
            color: theme === "dark" ? "white" : "black",
            indexAxis: "y", // To make the bars horizontal
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: `All Island Voting Results`,
                    color: theme === "dark" ? "white" : "black",
                },
            },
            scales: {
              x: {
                  ticks: {
                      color: theme === "dark" ? "white" : "black",
                  },
                  grid: {
                      color: theme === "dark" ? "#444" : "#ddd",
                  },
              },
              y: {
                  ticks: {
                      color: theme === "dark" ? "white" : "black", 
                  },
                  grid: {
                      color: theme === "dark" ? "#444" : "#ddd", 
                  },
              },
            }
        };

        return (
            <div className="barChart">
                <Bar data={data} options={options} />
            </div>
        );
    }

    const selectedDistrictData = districtData.find(
        (district) => district.districtName === districtName
    );

    if (!selectedDistrictData) {
        return <div>No voting data available for {districtName}.</div>;
    }

    if (buttonName === "district") {
        names = selectedDistrictData.districtResult.map(
            (districtResult) => districtResult.candidateName
        );
        chartData = selectedDistrictData.districtResult.map(
            (districtResult) => districtResult.totalVotes
        );
    } else if (buttonName === "postal") {
        names = selectedDistrictData.postalResult.map(
            (postalResult) => postalResult.candidateName
        );
        chartData = selectedDistrictData.postalResult.map(
            (postalResult) => postalResult.totalVotes
        );
    } else if (buttonName === "preference") {
        names = selectedDistrictData.preferenceResult.map(
            (preferenceResult) => preferenceResult.candidateName
        );
        chartData = selectedDistrictData.preferenceResult.map(
            (preferenceResult) => preferenceResult.totalVotes
        );
    } else {
        names = selectedDistrictData.districtResult.map(
            (districtResult) => districtResult.candidateName
        );
        chartData = selectedDistrictData.districtResult.map(
            (districtResult) => districtResult.totalVotes
        );
    }


    for (let i = 0; i < 5; i++) {
        const name = names[i];
        if (name === "Anura Kumara Dissanayake") {
            colors.push("#c80d4d");
        } else if (name === "Sajith Premadasa") {
            colors.push("#51a303");
        } else if (name === "Ranil Wickremesinghe") {
            colors.push("#fab002");
        } else if (name === "Namal Rajapaksa") {
            colors.push("#82072b");
        } else if (name === "Ariyanethiran Pakkiyaselvam") {
            colors.push("#fc6f03");
        } else {
            colors.push("#ababb3");
        }
    }

    const data = {
        labels: names,
        datasets: [
            {
                label: "Votes", 
                data: chartData, 
                backgroundColor: colors,
                borderRadius: 10,
            },
        ],
    };

 

    const options = {
        indexAxis: "y", 
        responsive: true,
        color: theme === "dark" ? "white" : "black",
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `${selectedDistrictData.districtName} Voting Results`,
                color: theme === "dark" ? "white" : "black",
            },
            datalabels: {
              display: false, 
          },
        },
        scales: {
          x: {
              ticks: {
                  color: theme === "dark" ? "white" : "black",
              },
              grid: {
                  color: theme === "dark" ? "#444" : "#ddd",
              },
          },
          y: {
              ticks: {
                  color: theme === "dark" ? "white" : "black", 
              },
              grid: {
                  color: theme === "dark" ? "#444" : "#ddd", 
              },
          },
        }
    };

    return (
        <div className="barChart">
            <Bar data={data} options={options} />
        </div>
    );
};

export default Chart;
