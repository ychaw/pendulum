import React from 'react';
import Sketch from "react-p5";
import p5Types from "p5";
import DoublePendulum from '../sim/double-pendulum';

function lerpRange(value: number, low1: number, high1: number, low2: number, high2: number) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

interface ComponentProps {
    dp: DoublePendulum
    paused: boolean
    volume: number
}


export default class VolumeVisualization extends React.Component<ComponentProps, {}> {

    orgDim: number[]
    dim: number[]
    history: number[]
    xRange: number
    padding: number


    constructor(props: any) {
        super(props);

        this.orgDim = [];
        this.dim = [];
        this.history = [];
        this.xRange = 100;
        this.padding = 30
    }

    setup = (p5: p5Types, canvasParentRef: Element) => {
        this.dim = [canvasParentRef.clientWidth, canvasParentRef.clientHeight];
        this.orgDim = this.dim;
        p5.createCanvas(this.dim[0], this.dim[1], 'p2d').parent(canvasParentRef);

        p5.frameRate(30);

        p5.windowResized = () => {
            let newWidth = document.getElementsByClassName('DetailBottomCard').item(0)?.clientWidth as number;
            let newHeight = document.getElementsByClassName('DetailBottomCard').item(0)?.clientHeight as number;
            if (newWidth !== this.dim[0] || newHeight !== this.dim[1]) {
                this.dim = [newWidth, newHeight];
                p5.resizeCanvas(this.dim[0], this.dim[1], true);
            }
        }
    }

    draw = (p5: p5Types) => {
        p5.clear();

        p5.translate(0, this.dim[1] / 2);

        p5.stroke('#2F80ED');
        p5.strokeWeight(3);

        let x = this.props.dp.x[1] * this.props.volume;

        if (!this.props.paused) {
            let newLength = this.history.push(x);
            if (newLength > this.xRange) {
                this.history.shift();
            }
        }

        let maxValue = Math.max(Math.max(...this.history), Math.abs(Math.min(...this.history)));
        let step = (this.dim[0] - this.padding * 2) / this.xRange;
        let halfHeight = this.dim[1] / 2;

        for (let i = 1; i < this.history.length; i++) {
            let previous = this.history.length > 0 ? this.history[i - 1] : this.history[i];
            let current = this.history[i];

            previous = lerpRange(previous, -maxValue, maxValue, - halfHeight + this.padding, halfHeight - this.padding);
            current = lerpRange(current, -maxValue, maxValue, - halfHeight + this.padding, halfHeight - this.padding);

            p5.line((i - 1) * step + this.padding, previous, i * step + this.padding, current);
        }
    }

    render() {
        return (
            <Sketch setup={this.setup} draw={this.draw} className="volumeVisualization" />
        );
    }
}