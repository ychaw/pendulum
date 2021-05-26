import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ComponentProps {
    spectrum: Float32Array
}

export default class FilterVisualization extends React.Component<ComponentProps, {}> {

    padding = 1;
    labelDist = -10;

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return this.props.spectrum !== nextProps.spectrum
    }


    render() {

        let data = []
        let raw_data = this.props.spectrum.filter(Boolean)

        for (let i = 0; i < raw_data.length; i++) {
            data[i] = {
                x: i,
                y: Math.log(raw_data[i])
            }
        }

        return (
            <ResponsiveContainer>
                <LineChart width={330} height={220} data={data} margin={{ top: 30, bottom: 30, left: 30, right: 30 }}>
                    <XAxis
                        hide={true}
                        dataKey='x'
                        type='number'
                        tick={false}
                    />
                    <YAxis
                        hide={true}
                        type='number'
                        tick={false}
                    />
                    <Line
                        type='monotone'
                        dataKey='y'
                        stroke='#2F80ED'
                        strokeWidth={3}
                        dot={false}
                        strokeLinecap='round'
                    />
                </LineChart>
            </ResponsiveContainer>
        )
    }
}