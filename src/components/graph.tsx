/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.css'
import { useEffect, useRef, useState } from "react";
import React from "react";
import * as d3 from "d3";

export default function Graph() {

    const [timeData, setTimeData] = React.useState<number[]>([500, 420, 350, 290, 240, 200, 170, 150, 135, 125, 120]);
    const [costData, setCostData] = React.useState<number[]>([180, 190, 202, 203, 201, 202, 203, 190, 185, 190, 200])
    const [xData, setXData] = useState([128, 256, 384, 512, 640, 768, 896, 1024, 1152, 1280, 2048]);
    const svgRef = useRef<SVGSVGElement | null>(null);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        d3.select("svg").selectAll("*").remove();
        // svg.selectAll("*").remove()
        setCostData([450, 400, 310, 490, 2400, 150, 1700, 150, 135, 1200, 120])
        setXData([128, 256, 484, 512, 540, 738, 900, 1024, 1352, 1580, 2048])
    }

    useEffect(() => {
        // setting up svg
        let width: number = 800;
        let height: number = 600;
        let heightLeftMagnitude = (Math.floor(Math.log10(Math.max(...timeData))))
        let heightLeft = 10 ** heightLeftMagnitude *
            Math.ceil(Math.max(...timeData) / (10 ** heightLeftMagnitude))
        let heightRightMagnitude = (Math.floor(Math.log10(Math.max(...costData))))
        let heightRight = 10 ** heightRightMagnitude *
            Math.ceil(Math.max(...costData) / (10 ** heightRightMagnitude))

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("overflow", "visible")

        // x-axis range
        const xScale = d3
            .scaleLinear()
            .domain([0, timeData.length - 1])
            .range([0, width]);

        //y-axes range
        const yScaleLeft = d3
            .scaleLinear() //<(value: number) => number | undefined>
            .domain([0, heightLeft])
            .range([height, 0]);

        const yScaleRight = d3
            .scaleLinear()
            .domain([0, heightRight])
            .range([height, 0]);

        //  Setup functions to draw Lines ---------------//
        const invocationTime = d3
            .line()
            .x((d, i) => xScale(i))
            .y((d: any) => yScaleLeft(d))
            .curve(d3.curveCardinal);

        const runtimeCost = d3
            .line()
            .x((d, i) => xScale(i))
            .y((d: any) => yScaleRight(d))
            .curve(d3.curveCardinal);

        // setting the axes
        const xAxis = d3.axisBottom(xScale).tickFormat((i: any): any => xData[i]);
        // const xAxis = d3.axisBottom(xScale).tickFormat(function(i: number): number { xData[i] });
        const yAxisLeft = d3.axisLeft(yScaleLeft).ticks(10);
        // var yAxisRight = d3.svg.axis().scale(y1)
        //   .orient("right").ticks(5).tickSize(-width);
        const yAxisRight = d3.axisRight(yScaleRight).ticks(10);

        // svg.append("g").call(xAxis).attr("transform", `translate(0,${heightLeft})`);
        // svg.append("g").call(yAxisLeft);
        svg.append("g").attr("transform", `translate(${width},0)`).call(yAxisRight);

        // setting up the data for the svg
        svg
            .selectAll(".invocationLine")
            .data([timeData])
            .join("path")
            .attr("d", (d: any) => invocationTime(d))
            .attr("fill", "none")
            .attr("stroke", "blue");

        svg
            .selectAll(".costDataLine")
            .data([costData])
            .join("path")
            .attr("d", (d: any) => runtimeCost(d))
            .attr("fill", "none")
            .attr("stroke", "red");

        // axis labels
        const yAxisLeftLabel = svg.append("g").classed("yAxis", true).call(yAxisLeft);
        const yAxisRightLabel = svg.append("g").attr("transform", `translate(${width},0)`).call(yAxisRight);
        const xAxisLabel = svg.append("g").call(xAxis).attr("transform", `translate(0,${height})`);

        yAxisLeftLabel
            .append("text")
            .attr("fill", "black")
            .text('Invocation Time')
            .attr("x", -(height / 2))
            .attr("y", -50)
            .style("transform", "rotate(270deg)")
            .style("text-anchor", "middle")
            .style("font-size", "1.2rem");

        yAxisRightLabel
            .append("text")
            .attr("fill", "black")
            .text('Runtime Cost')
            .attr("x", -(height / 2))
            .attr("y", 50)
            .style("transform", "rotate(270deg)")
            .style("text-anchor", "middle")
            .style("font-size", "1.2rem");

        xAxisLabel
            .append("text")
            .attr("fill", "black")
            .text('Memory (MB)')
            .attr("x", width / 2)
            .attr("y", 50)
            .style("text-anchor", "middle")
            .style("font-size", "1.2rem");
    }, [timeData, costData, xData]);


    return (
        <div className="chartWrapper" >
            <h2>Line Charts </h2>
            <svg className="svgWrap" ref={svgRef} style={{ margin: "50px", display: "block", width: "800px", height: "600px" }
            }></svg>
            <button onClick={onSubmit}>click to change value</button>
        </div>
    );
};


