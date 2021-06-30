import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import DoublePendulum from '../sim/double-pendulum';

interface ComponentProps {
    dp: DoublePendulum
    paused: boolean
    volume: number
}

interface ComponentState {
    history: number[]
}

export default class VolumeVisualization extends React.Component<ComponentProps, ComponentState> {

    intervalID: number

    constructor(props: any) {
        super(props);
        this.intervalID = 0;
        this.state = {
            history: []
        }
    }

    shouldComponentUpdate(nextProps: ComponentProps, nextState: ComponentState) {
        return this.props.volume !== nextProps.volume
            || this.props.paused !== nextProps.paused
    }

    componentDidMount() {
        //this.intervalID = setInterval(this.get_pendulum_state.bind(this), 70);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    get_pendulum_state() {
        let x = this.props.dp.x[1] * this.props.volume;
        if (!this.props.paused) {
            let newHistory = this.state.history;
            let newLength = newHistory.push(x);
            if (newLength > 100) {
                newHistory.shift();
            }
            this.setState({ history: newHistory });
            this.forceUpdate()
        }
    }

    render() {

        let data = []
        let maxVal = 100;

        for (let i = 0; i < this.state.history.length; i++) {
            data[i] = {
                x: i,
                y: this.state.history[i]
            }
            maxVal = this.state.history[i] > maxVal ? this.state.history[i] : maxVal;
        }

        maxVal *= 1.2;

        return (
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 30, bottom: 30, left: 30, right: 30 }}>
                    <XAxis
                        hide={true}
                        dataKey='x'
                        type='number'
                        domain={[0, 100]}
                        tick={false}
                    />
                    <YAxis
                        hide={true}
                        type='number'
                        domain={[-maxVal, maxVal]}
                        allowDataOverflow={true}
                        tick={false}
                    />
                    <Line
                        type='monotone'
                        dataKey='y'
                        stroke='#2F80ED'
                        strokeWidth={3}
                        dot={false}
                        strokeLinecap='round'
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        )
    }
}
