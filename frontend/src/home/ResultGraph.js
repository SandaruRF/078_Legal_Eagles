import React, { useEffect, useRef, useState,useContext} from 'react';
import { ThemeContext } from "../ThemeContext";
import * as d3 from 'd3';
import './ResultGraph.css';

// Light theme images
import anuraImageLight from '../images/anuraGraphLight.png'; 
import sajithImageLight from '../images/sajithGraphLight.jpg';
import ranilImageLight from '../images/ranilGraphLight.jpg';
import namalImageLight from '../images/namalGraphLight.png';
import ariyanethiranImageLight from '../images/AriyanethiranGraphLight.png';
import dilithImageLight from '../images/dilithGraphLight.png';
import othersImageLight from '../images/userLight.png';

// Dark theme images
import anuraImageDark from '../images/anuraGraphDark.png'; 
import sajithImageDark from '../images/sajithGraphDark.png';
import ranilImageDark from '../images/ranilGraphDark.png';
import namalImageDark from '../images/namalGraphDark.png';
import ariyanethiranImageDark from '../images/AriyanethiranGraphDark.png';
import dilithImageDark from '../images/dilithGraphDark.png';
import othersImageDark from '../images/userDark.png';

const BarChart = () => {
  const { theme } = useContext(ThemeContext);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 700, height: 600 });

  // Choose images based on theme
  const populationData = theme === 'dark' ? [
    { candidate: 'Anura\nKumara', percentage: 42.31, total: 5634915, flagUrl: anuraImageDark, color: '#c80d4d' },
    { candidate: 'Sajith\nPremadasa', percentage: 32.76, total: 4363035, flagUrl: sajithImageDark, color: '#51a303' },
    { candidate: 'Ranil\nWickramasinghe', percentage: 17.27, total: 2299767, flagUrl: ranilImageDark, color: '#fab002' },
    { candidate: 'Namal\nRajapaksa', percentage: 2.57, total: 342781, flagUrl: namalImageDark, color: '#82072b' },
    { candidate: 'P. \nAriyanethiran', percentage: 1.7, total: 226343, flagUrl: ariyanethiranImageDark, color: '#fc6f03' },
    { candidate: 'Dilith\nJayaweera', percentage: 0.92, total: 122396, flagUrl: dilithImageDark, color: '#1C3C8C' },
    { candidate: 'Other\nVotes', percentage: 2.47, total: 330379, flagUrl: othersImageDark, color: '#ababb3' },
  ] : [
    { candidate: 'Anura\nKumara', percentage: 42.31, total: 5634915, flagUrl: anuraImageLight, color: '#c80d4d' },
    { candidate: 'Sajith\nPremadasa', percentage: 32.76, total: 4363035, flagUrl: sajithImageLight, color: '#51a303' },
    { candidate: 'Ranil\nWickramasinghe', percentage: 17.27, total: 2299767, flagUrl: ranilImageLight, color: '#fab002' },
    { candidate: 'Namal\nRajapaksa', percentage: 2.57, total: 342781, flagUrl: namalImageLight, color: '#82072b' },
    { candidate: 'P. \nAriyanethiran', percentage: 1.7, total: 226343, flagUrl: ariyanethiranImageLight, color: '#fc6f03' },
    { candidate: 'Dilith\nJayaweera', percentage: 0.92, total: 122396, flagUrl: dilithImageLight, color: '#1C3C8C' },
    { candidate: 'Other\nVotes', percentage: 2.47, total: 330379, flagUrl: othersImageLight, color: '#ababb3' },
  ];

  // Change background and text color based on theme
  const backgroundColor = theme === "dark" ? "#212121" : "white"; // ash background for dark theme
  const textColor = theme === "dark" ? "white" : "black"; // white text for dark theme

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { width, height } = wrapperRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 80, bottom: 40, left: 200 }; 
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const minBarWidth = 8;

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, chartWidth * 2]);

    const y = d3.scaleBand()
      .domain(populationData.map(d => d.candidate))
      .range([0, chartHeight])
      .padding(0.15);


    svg.selectAll('*').remove();


    svg.style('background-color', backgroundColor);


    svg.selectAll('.bar')
      .data(populationData)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', margin.left)
      .attr('y', d => y(d.candidate) + margin.top)
      .attr('width', d => Math.max(minBarWidth, x(d.percentage)))
      .attr('height', y.bandwidth())
      .style('fill', d => d.color)
      .style('stroke', theme === 'dark' ? 'white' : 'none') 
      .style('stroke-width', '0.5'); 

    svg.selectAll('.candidate-name')
      .data(populationData)
      .join('foreignObject')
      .attr('class', 'candidate-name')
      .attr('x', margin.left - 120)
      .attr('y', d => y(d.candidate) + y.bandwidth() / 2 - 10) 
      .attr('width', 150)
      .attr('height', 40)
      .append('xhtml:div')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('color', textColor) 
      .style('overflow', 'hidden')
      .style('pointer-events', 'none') 
      .html(d => d.candidate.replace('\n', '<br/>'));


    svg.selectAll('.percentage')
      .data(populationData)
      .join('text')
      .attr('class', 'percentage')
      .attr('x', d => margin.left + Math.max(minBarWidth, x(d.percentage)) + 60)
      .attr('y', d => y(d.candidate) + y.bandwidth() / 2 + margin.top)
      .attr('dy', '0.35em')
      .text(d => `${d.percentage}%`)
      .style('fill', textColor) 
      .style('font-size', '15px')
      .style('font-weight', 'bold');

    svg.selectAll('.flag')
      .data(populationData)
      .join('image')
      .attr('class', 'flag')
      .attr('x', d => margin.left +5+ Math.max(minBarWidth, x(d.percentage)))
      .attr('y', d => y(d.candidate) + margin.top)
      .attr('width', 50)
      .attr('height', y.bandwidth())
      .attr('href', d => d.flagUrl);

  }, [dimensions, theme, populationData, backgroundColor, textColor]); 

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', minHeight: '400px', backgroundColor }} className="graph-container">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
    </div>
  );
};

export default BarChart;
