import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ComponentProps {
    a: number,
    d: number,
    s: number,
    r: number
}

export default class EnvelopeVisualization extends React.Component<ComponentProps, {}> {

    // padding = 1;
    // labelDist = -10;

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return this.props.a !== nextProps.a || this.props.d !== nextProps.d || this.props.s !== nextProps.s || this.props.r !== nextProps.r
    }


    render() {

        const max = this.props.a + this.props.d + 100 + this.props.r;

        const data = [
            {
                x: 0,
                y: 0
            },
            {
                x: this.props.a,
                y: 100
            },
            {
                x: this.props.a + this.props.d,
                y: this.props.s
            },
            {
                x: max - this.props.r,
                y: this.props.s
            },
            {
                x: max,
                y: 0
            }
        ];

        return (
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 30, bottom: 30, left: 30, right: 30 }}>
                    <XAxis
                        hide={true}
                        dataKey='x'
                        type='number'
                        domain={[0, data[4].x]}
                        tick={false}
                    />
                    <YAxis
                        hide={true}
                        type='number'
                        domain={[0, data[1].y]}
                        tick={false}
                    />

                    {/*
                    <ReferenceLine
                        stroke='white'
                        label={{ value: 'S', position: 'right', fill: 'white', fontFamily: 'Raleway' }}
                        segment={[
                            {
                                x: data[2].x + (data[3].x - data[2].x) / 2,
                                y: data[0].y
                            },
                            {
                                x: data[2].x + (data[3].x - data[2].x) / 2,
                                y: data[2].y - 3
                            }
                        ]}
                        strokeWidth={2}
                    />
                    
                    <ReferenceLine
                        stroke='white'
                        label={{ value: 'A', position: 'bottom', fill: 'white', fontFamily: 'Raleway' }}
                        ifOverflow='extendDomain'
                        segment={[
                            { x: data[0].x + this.padding, y: this.labelDist },
                            { x: data[1].x - this.padding, y: this.labelDist }
                        ]}
                        strokeWidth={2}
                    />
                    
                    <ReferenceLine
                        stroke='white'
                        label={{ value: 'D', position: 'bottom', fill: 'white', fontFamily: 'Raleway' }}
                        ifOverflow='extendDomain'
                        segment={[
                            { x: data[1].x + this.padding, y: this.labelDist },
                            { x: data[2].x - this.padding, y: this.labelDist }
                        ]}
                        strokeWidth={2}
                    />
                    
                    <ReferenceLine
                        stroke='white'
                        label={{ value: 'R', position: 'bottom', fill: 'white', fontFamily: 'Raleway' }}
                        ifOverflow='extendDomain'
                        segment={[
                            { x: data[3].x + this.padding, y: this.labelDist },
                            { x: data[4].x - this.padding, y: this.labelDist }
                        ]}
                        strokeWidth={2}
                    />
                    */}

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