import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios"; 


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [values, setValues] = useState({
    value1: null,
    value2: null,
    value3: null,
    value4: null,
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
        });
      } catch (error) {
        console.error("Error fetching values", error);
      }
    };

    fetchValues(); 
  }, []);
  const votePercentages = [values.ranil, values.anura, values.sajith, values.namal]; 

  const data = {
    labels: ['Ranil Wickremesinghe', 'Anura Kumara', 'Sajith Premadasa', 'Namal Rajapaksa'],
    datasets: [
      {
        label: 'Vote Percentage (%)',
        data: votePercentages, 
        backgroundColor: [
          'rgba(11, 119, 8, 0.6)', 
          'rgba(196, 9, 74, 0.6)', 
          'rgba(254, 212, 49, 0.6)',
          'rgba(135, 23, 26, 0.6)'  
        ],
        borderColor: [
          'rgba(11, 119, 8, 1)',
          'rgba(196, 9, 74, 1)',
          'rgba(254, 212, 49, 1)',
          'rgba(135, 23, 26, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
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

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center', 
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
      }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;

