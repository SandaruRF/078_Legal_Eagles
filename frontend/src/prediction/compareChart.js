import React, { useEffect, useRef, useState,forwardRef } from 'react';
import * as d3 from 'd3';
import axios from "axios";

const MultipleBarChart = ({ theme },ref) => {
    const [values, setValues] = useState({
        ranil: null,
        anura: null,
        sajith: null,
        namal: null,
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

    const fetchedData = [
        { candidate: 'Ranil', total: values.ranil }, 
        { candidate: 'Anura', total: values.anura },
        { candidate: 'Sajith', total: values.sajith },
        { candidate: 'Namal', total: values.namal },
    ];

    const staticVoteData = [ 
        { candidate: 'Ranil', total: 17.27 }, 
        { candidate: 'Anura', total: 42.31 },
        { candidate: 'Sajith', total: 32.76 },
        { candidate: 'Namal', total: 2.57 },
    ];

    const svgRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 700, height: 400 });

    const backgroundColor = theme === "dark" ? "#212121" : "white";
    const textColor = theme === "dark" ? "white" : "black";
    const axisColor = theme === "dark" ? "white" : "black"; 

    const isMobile = window.innerWidth < 500;

    useEffect(() => {
        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        const margin = { top: 150, right: 30, bottom: 100, left: 60 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
    
        const x0 = d3.scaleBand()
            .domain(fetchedData.map(d => d.candidate))
            .range([0, chartWidth])
            .padding(0.1);
    
        const x1 = d3.scaleBand()
            .domain(['Fetched Data', 'Static Data'])
            .range([0, x0.bandwidth()])
            .padding(0.05);
    
        const y = d3.scaleLinear()
            .domain([0, d3.max([...fetchedData.map(d => d.total), ...staticVoteData.map(d => d.total)])])
            .nice()
            .range([chartHeight, 0]);
    
        svg.selectAll('*').remove();
        svg.style('background-color', backgroundColor);
    
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
    
        const bars = g.append('g')
            .selectAll('g')
            .data(fetchedData)
            .enter().append('g')
            .attr('transform', d => `translate(${x0(d.candidate)},0)`);
    
        // Add smooth animated bars
        bars.selectAll('rect')
            .data(d => [d.total, staticVoteData.find(staticItem => staticItem.candidate === d.candidate).total])
            .enter().append('rect')
            .attr('x', (d, i) => x1(i === 0 ? 'Fetched Data' : 'Static Data'))
            .attr('y', chartHeight) // Start at the bottom
            .attr('width', x1.bandwidth())
            .attr('height', 0) // Initially set height to 0
            .attr('fill', (d, i) => (i === 0 ? 'steelblue' : 'orange'))
            .transition() // Smooth transition
            .duration(1000) // Animation duration in ms
            .ease(d3.easeCubic) // Use a smooth easing function
            .attr('y', d => y(d)) // Final y position
            .attr('height', d => chartHeight - y(d)); // Final height
    
        // Fetched data text with smooth animation
        bars.selectAll('.fetched-text')
            .data(d => [d.total])
            .enter().append('text')
            .attr('class', 'fetched-text')
            .attr('x', (d) => x1('Fetched Data') + x1.bandwidth() / 2)
            .attr('y', chartHeight) // Initially start at the bottom
            .attr('text-anchor', 'middle')
            .style('fill', theme === "dark" ? "white" : "black")
            .style("font-size", isMobile ? 12 : 15)
            .style("font-weight", "bold")
            .transition() // Smooth text transition
            .duration(1000)
            .ease(d3.easeCubic)
            .attr('y', d => y(d) - 5) // Move to final y position
            .text(d => d + '%');
    
        // Static data text with smooth animation
        bars.selectAll('.static-text')
            .data(d => [staticVoteData.find(staticItem => staticItem.candidate === d.candidate).total])
            .enter().append('text')
            .attr('class', 'static-text')
            .attr('x', (d) => x1('Static Data') + x1.bandwidth() / 2)
            .attr('y', chartHeight) // Initially start at the bottom
            .attr('text-anchor', 'middle')
            .style('fill', theme === "dark" ? "white" : "black")
            .style("font-size", isMobile ? 12 : 15)
            .style("font-weight", "bold")
            .transition() // Smooth text transition
            .duration(1000)
            .ease(d3.easeCubic)
            .attr('y', d => y(d) - 5)
            .text(d => d + '%');
    
        // Add x-axis
        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .style("fill", textColor)
            .style("font-size", isMobile ? 12 : 15)
            .style("font-weight", "bold");
    
        g.select('.axis--x').select('path').style('stroke', axisColor);
        g.select('.axis--x').selectAll('line').style('stroke', axisColor);
    
        // Add y-axis
        g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("fill", textColor)
            .style("font-size", isMobile ? 12 : 15)
            .style("font-weight", "bold");
    
        g.select('.axis--y').select('path').style('stroke', axisColor);
        g.select('.axis--y').selectAll('line').style('stroke', axisColor);
        
        const legend = svg.append("g")
        .attr("transform", `translate(${width-200}, ${margin.top - 50})`);
    
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", 'steelblue'); 

    legend.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text("Predicted Percentage")
        .style("fill", textColor)
        .style("font-size", 14)
        .style("font-weight", "bold");

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 30)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", 'orange'); 
    legend.append("text")
        .attr("x", 30)
        .attr("y", 45)
        .text("Real Percentage")
        .style("fill", textColor)
        .style("font-size", 14)
        .style("font-weight", "bold");

    }, [dimensions, fetchedData, staticVoteData, backgroundColor, textColor, axisColor]);

    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                const { width, height } = svgRef.current.getBoundingClientRect();
                setDimensions({ width: Math.min(width, 1000), height }); 
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div ref={ref} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <svg  
                ref={svgRef} 
                width="100%" 
                height="700" 
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            ></svg>
        </div>
    );
};

export default forwardRef(MultipleBarChart);
