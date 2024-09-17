import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from "axios"; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels); // Register the plugin

const BarChart = () => {
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
        const response = await axios.get("http://127.0.0.1:8000/get-values");
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
    'Ranil Wickremesinghe':'rgba(11, 119, 8, 0.6)',
    'Anura Kumara': 'rgba(196, 9, 74, 0.6)',
    'Sajith Premadasa':'rgba(254, 212, 49, 0.6)',
    'Namal Rajapaksa': 'rgba(135, 23, 26, 0.6)'
  };
  
  const borderColorMap = {
    'Ranil Wickremesinghe':'rgba(11, 119, 8, 1)',
    'Anura Kumara': 'rgba(196, 9, 74, 1)',
    'Sajith Premadasa': 'rgba(254, 212, 49, 1)' ,
    'Namal Rajapaksa': 'rgba(135, 23, 26, 1)'
  };
  
  const votePercentages = [values.ranil, values.anura, values.sajith, values.namal]; 

  const data1 = {
    labels: ['Ranil Wickremesinghe', 'Anura Kumara', 'Sajith Premadasa', 'Namal Rajapaksa'],
    datasets: [
      {
        label: 'Vote Percentage (%)',
        data: votePercentages, 
        backgroundColor: [colorMap['Ranil Wickremesinghe'],colorMap['Anura Kumara'],colorMap['Sajith Premadasa'],colorMap['Namal Rajapaksa']],
        borderColor: [borderColorMap['Ranil Wickremesinghe'],borderColorMap['Anura Kumara'],borderColorMap['Sajith Premadasa'],borderColorMap['Namal Rajapaksa']],
        borderWidth: 1,
      },
    ],
  };

  const options1 = {
    responsive: true, 
    plugins: {
      title: {
        display: true,
        text: 'Predicted Results',
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
      datalabels: {
        display: true,
        color: '#000',
        anchor: 'center',
        align: 'center',
        formatter: (value) => `${value}%`,
        font: {
          weight: 'bold',
          size: 15,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`, 
        },
      },
    },
  };
  
  const secondChartData = {
    labels: [values.secondVoteName1, values.secondVoteName2],
    datasets: [
      {
        label: 'Second Vote Percentage (%)',
        data: [values.secondVoteVal1, values.secondVoteVal2],
        backgroundColor: [colorMap[values.secondVoteName1], colorMap[values.secondVoteName2]],
        borderColor: [borderColorMap[values.secondVoteName1] ,borderColorMap[values.secondVoteName2] ],
        borderWidth: 1,
      },
    ],
  };
  

  const secondChartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: 'Second Vote Analysis',
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
      datalabels: {
        display: true,
        color: '#000',
        anchor: 'end',
        align: 'top',
        formatter: (value) => `${value}%`,
        font: {
          weight: 'bold',
          size: 15,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      minHeight: '600px',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '80%',
        height: 'auto',
        maxWidth: '800px',
        marginBottom: '100px',
      }}>
        <Bar data={data1} options={options1} />
      </div>
      
      {values.secondVoteVal1 !== null && values.secondVoteVal2 !== null && (
        <div style={{
          width: '80%',
          height: 'auto',
          maxWidth: '800px',
        }}>
          <Bar data={secondChartData} options={secondChartOptions} />
        </div>
      )}
    </div>
  );
};

export default BarChart;
