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

const DoughnutChartPolled = ({ districtName, buttonName }) => {
  const { theme } = useContext(ThemeContext);
  //console.log(buttonName);
  let chartData = [];
  let names = [];
  let heading;

  if (!districtName) {
    const data = {
      labels: ["polled", "not polled"], // X-axis labels
      datasets: [
        {
          label: "Votes", // Chart label
          data: [13619916, 3520438],
          backgroundColor: ["#1A4870", "#5B99C2"],
          borderColor: ["#1A4870", "#5B99C2"],
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
      <div className="doughnutChartPolled">
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
    names = ["polled", "not polled"];
    chartData = [
      selectedDistrictData.districtVotes[0].totalPolledCount,
      selectedDistrictData.districtVotes[0].totalElectorsCount -
        selectedDistrictData.districtVotes[0].totalPolledCount,
    ];
  } else if (buttonName === "postal") {
    names = ["polled", "not polled"];
    chartData = [
      selectedDistrictData.postalVotes[0].totalPolledCount,
      selectedDistrictData.postalVotes[0].totalElectorsCount -
        selectedDistrictData.postalVotes[0].totalPolledCount,
    ];
  } else if (buttonName === "preference") {
    names = [];
    chartData = [];
  } else {
    names = ["polled", "not polled"];
    chartData = [
      selectedDistrictData.districtVotes[0].totalPolledCount,
      selectedDistrictData.districtVotes[0].totalElectorsCount -
        selectedDistrictData.districtVotes[0].totalPolledCount,
    ];
  }

  const data = {
    labels: names, // X-axis labels
    datasets: [
      {
        label: "Votes", // Chart label
        data: chartData,
        backgroundColor: ["#1A4870", "#5B99C2"],
        borderColor: ["#1A4870", "#5B99C2"],
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
    <div className="doughnutChartPolled">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChartPolled;
