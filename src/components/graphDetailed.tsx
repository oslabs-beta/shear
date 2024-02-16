/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.css'
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { RootState } from "../store.ts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function GraphDetailed() {
    const graphData = useSelector((state: RootState) => state.results)
    const timeData = graphData.DetailedTimeData;
    const costData = graphData.DetailedCostData;
    const xData = graphData.DetailedMemoryData;
    const [first, setFirst] = useState(true)
    const [noGraph, setNoGraph] = useState(false);

    //converts raw data into appropriate format for graph
    const convertData = () => {
        { first ? null : setNoGraph(true) };
        setFirst(false);

        const temp = []
        for (let i = 0; i < xData.length; i++) {
            temp.push({
                'Memory': xData[i],
                'Invocation time': timeData[i],
                'Runtime cost': costData[i]
            })
        }
        setData(temp)
    }

    const [data, setData] = useState([]);

    useEffect(() => {
        convertData()
    }, [graphData])

    // Recharts code; largely self-explanatory
    return (
        <div className="graphDetailed">
            <ResponsiveContainer
                width="100%"
                height="100%"
                minHeight={400}
            // aspect={2.4}
            >
                <LineChart
                    width="100%"
                    height="100%"
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Memory" tick={{ fontSize: 20 }} />
                    <YAxis
                        yAxisId="left"
                        label={{
                            value: `Invocation Time`,
                            style: { textAnchor: 'middle' },
                            angle: -90,
                            position: 'left',
                            offset: 8,
                            fontSize: 25,
                        }}
                        tick={{ fontSize: 20 }}
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
                            fontSize: 25,
                        }}
                        tick={{ fontSize: 20 }}
                    />
                    <Tooltip cursor={{ strokeWidth: 4, }} wrapperStyle={{ fontSize: "25px" }} />
                    <Legend wrapperStyle={{ fontSize: "20px", fontWeight: "bold" }} iconSize={28} />
                    {noGraph ? <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey='Invocation time'
                        stroke="#4285F4"
                        activeDot={{ r: 15 }}
                        strokeWidth="7px"
                    /> : <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey='Invocation time'
                        stroke="#4285F4"
                        dot={false}
                        strokeWidth="0px"
                    />}

                    {noGraph ? <Line yAxisId="right"
                        type="monotone"
                        dataKey="Runtime cost"
                        stroke="#82ca9d"
                        activeDot={{ r: 15 }}
                        strokeWidth="7px" /> :
                        <Line yAxisId="right"
                            type="monotone"
                            dataKey="Runtime cost"
                            stroke="#82ca9d"
                            dot={false}
                            strokeWidth="0px" />}

                </LineChart>
            </ResponsiveContainer>
            {/* <button onClick={convertData}>Testtest</button> */}
        </div>
    );
};


