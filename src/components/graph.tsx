/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.css'
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../store.ts";
import React from "react";
import * as d3 from "d3";
import { runOptimizer } from "../formData/resultsSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Graph() {
    const graphData = useSelector((state: RootState) => state.results)
    const timeData = graphData.TimeData;
    const costData = graphData.CostData;
    const xData = graphData.MemoryData;


    const svgRef = useRef<SVGSVGElement | null>(null);

    const data = [
        {
            memory: 128,
            invocation_time: 4000,
            runtime_cost: 2400,
        },
        {
            memory: 256,
            invocation_time: 3000,
            runtime_cost: 1398,
        },
        {
            memory: 512,
            invocation_time: 2000,
            runtime_cost: 9800,
        },
        {
            memory: 768,
            invocation_time: 2780,
            runtime_cost: 3908,
        },
        {
            memory: 1024,
            invocation_time: 1890,
            runtime_cost: 4800,
        },
        {
            memory: 2048,
            invocation_time: 2390,
            runtime_cost: 3800,
        },
        {
            memory: 4096,
            invocation_time: 3490,
            runtime_cost: 4300,
        }
    ];
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

        svg.selectAll("*").remove()
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
            .attr("stroke-width", "3")
            .attr("stroke", "blue");

        svg
            .selectAll(".costDataLine")
            .data([costData])
            .join("path")
            .attr("d", (d: any) => runtimeCost(d))
            .attr("fill", "none")
            .attr("stroke-width", "3")
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
            .attr("y", 70)
            .style("text-anchor", "middle")
            .style("font-size", "1.2rem")
            .style('margin', '10px');
    }, [graphData]);


    return (
        <div className="chartWrapper" >
            return (
            <LineChart
                width={1000}
                height={600}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="memory" />
                <YAxis
                    yAxisId="left"
                    label={{
                        value: `Invocation Time`,
                        style: { textAnchor: 'middle' },
                        angle: -90,
                        position: 'left',
                        offset: 0,
                    }}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                        value: `Runtime Cost`,
                        style: { textAnchor: 'middle' },
                        angle: -90,
                        position: 'right',
                        offset: 0,
                    }}
                />
                <Tooltip />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="invocation_time"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line yAxisId="right"
                    type="monotone"
                    dataKey="runtime_cost"
                    stroke="#82ca9d" />
            </LineChart>

        </div>
    );
};


