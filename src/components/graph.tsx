/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.css'
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { RootState } from "../store.ts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function Graph() {
    const graphData = useSelector((state: RootState) => state.results)
    const timeData = graphData.TimeData;
    const costData = graphData.CostData;
    const xData = graphData.MemoryData;

    //converts raw data into appropriate format for graph
    const convertData = () => {
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
        //setShow(false)
        convertData()
    }, [graphData.TimeData])

    // Recharts code; largely self-explanatory
    return (
        <div>
            <ResponsiveContainer
                width="100%"
                height={600}
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
                    <XAxis dataKey="Memory" />
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
                        dataKey='Invocation time'
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line yAxisId="right"
                        type="monotone"
                        dataKey="Runtime cost"
                        stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
            {/* <button onClick={convertData}>Testtest</button> */}
        </div>
    );
};


