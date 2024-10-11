import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { ThemeContext } from "../ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale, // Import the category scale
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import districtData from "../data/electioin_data.json";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DoughnutChartValid = ({ districtName, buttonName }) => {
  const { theme } = useContext(ThemeContext);
  //console.log(buttonName);
  let chartData = [];
  let names = [];
  let heading;

  if (!districtName) {
    const data = {
      labels: ["valid", "rejected     "], // X-axis labels
      datasets: [
        {
          label: "Votes", // Chart label
          data: [13319616, 300300],
          backgroundColor: ["#035c5c", "#1c9e9e"],
          borderColor: ["#035c5c", "#1c9e9e"],
        },
      ],
    };

    //console.log(data.lables);

    const options = {
      color: theme === "dark" ? "white" : "black",
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
        },
        datalabels: {
          display: false, 
      },
      },
    };

    return (
      <div className="doughnutChartValid">
        <Doughnut data={data} options={options} />
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
    names = ["valid", "rejected     "];
    chartData = [
      selectedDistrictData.districtVotes[0].validVotesCount,
      selectedDistrictData.districtVotes[0].rejectedVotesCount,
    ];
  } else if (buttonName === "postal") {
    names = ["valid", "rejected     "];
    chartData = [
      selectedDistrictData.postalVotes[0].validVotesCount,
      selectedDistrictData.postalVotes[0].rejectedVotesCount,
    ];
  } else if (buttonName === "preference") {
    names = [];
    chartData = [];
  } else {
    names = ["valid", "rejected     "];
    chartData = [10, 20];
    chartData = [
      selectedDistrictData.districtVotes[0].validVotesCount,
      selectedDistrictData.districtVotes[0].rejectedVotesCount,
    ];
  }

  const data = {
    labels: names, // X-axis labels
    datasets: [
      {
        label: "Votes", // Chart label
        data: chartData,
        backgroundColor: ["#035c5c", "#1c9e9e"],
        borderColor: ["#035c5c", "#1c9e9e"],
      },
    ],
  };

  //console.log(data.lables);

  const options = {
    color: theme === "dark" ? "white" : "black",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
      datalabels: {
        display: false, 
    },
    },
  };

  return (
    <div className="doughnutChartValid">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChartValid;
