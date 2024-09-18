import React, { useState, useRef } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {NavBar} from "../navbar/NavBar";
import {Banner} from "./Banner";
import Footer from "../footer/Footer";
import BarChart from './BarChart';


function Homepage() {
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);

  const handleShowChart = () => {
    setTimeout(() => {
      setShowChart(true); 

      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.scrollIntoView({ behavior: 'smooth' }); 
        }
      }, 100); 
    }, 3500); 
  };

  return (
    <div className="App">
      <NavBar/>
      <Banner onShowChart={handleShowChart} isChartLoaded={showChart} />

      {showChart && (
        <div ref={chartRef}>
          <BarChart />
        </div>
      )}
       <br></br>
      <Footer/>
    </div>
  );
}

export default Homepage;