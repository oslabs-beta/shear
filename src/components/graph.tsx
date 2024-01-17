/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.css'
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { RootState } from "../store.ts";
import React from "react";
import { runOptimizer } from "../formData/resultsSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function Graph() {
    const graphData = useSelector((state: RootState) => state.results)
    const timeData = graphData.TimeData;
    const costData = graphData.CostData;
    const xData = graphData.MemoryData;

    const convertData = () => {
        const temp = []
        for (let i = 0; i < xData.length; i++) {
            temp.push({
                memory: xData[i],
                invocation_time: timeData[i],
                runtime_cost: costData[i]
            })
        }
        setData(temp)
    }

    const [data, setData] = useState([
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
    ]);


    useEffect(() => {
        convertData()
    }, [graphData])

    return (
        <div>
            <ResponsiveContainer
                width="100%"
                height={600}
            >

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

            </ResponsiveContainer>
            <button onClick={convertData}>Testtest</button>
        </div>
    );
};


