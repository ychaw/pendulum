import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { DoublePendulum } from "../sim/double-pendulum";

function mapRange(value: number, low1: number, high1: number, low2: number, high2: number) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

interface ComponentProps {
    dp: DoublePendulum
    readonly memorySettings: {
        drawMode: 'solidLine' | 'fadingLine' | 'dots',
        maxMem: number,
        fadingStart: number,
        strokeWeight: number,
        drawColor: number[],
    }
    readonly pendulumSettings: {
        drawColor: number[],
        legWeight: number,
        ankleWidth: number
    }
    canvasDoubleClicked: any
}

export default class PendulumVisualization extends React.Component<ComponentProps, {}> {

    mem: number[][]
    orgDim: number[]
    dim: number[]
    buffer: p5Types.Graphics
    padding: number
    paused: boolean
    props: ComponentProps

    constructor(props: any) {
        super(props);

        this.props = props;

        this.mem = [];
        this.orgDim = [];
        this.dim = [];
        this.padding = 70;
        this.buffer = null as unknown as p5Types.Graphics

        this.paused = true;
    }

    setup = (p5: p5Types, canvasParentRef: Element) => {

        this.dim = [canvasParentRef.clientWidth, canvasParentRef.clientHeight];
        this.orgDim = this.dim;
        let cnv = p5.createCanvas(this.dim[0], this.dim[1], 'p2d').parent(canvasParentRef);

        cnv.doubleClicked((event) => {
            this.paused = !this.paused;
            this.mem = [];
            this.props.canvasDoubleClicked(this.paused);
        })

        p5.windowResized = () => {
            let newWidth = document.getElementsByClassName('FocusCard').item(0)?.clientWidth as number;
            let newHeight = document.getElementsByClassName('FocusCard').item(0)?.clientHeight as number;
            if (newWidth !== this.dim[0] || newHeight !== this.dim[1]) {
                this.dim = [newWidth, newHeight];
                p5.resizeCanvas(this.dim[0], this.dim[1], true);
                this.buffer.resizeCanvas(this.dim[0] - this.padding, this.dim[1] - this.padding, true);
                this.buffer.translate(this.dim[0] / 2, this.dim[1] / 2);
            }
        }

        console.log(this.props.dp.theta);

        this.buffer = p5.createGraphics(this.dim[0] - this.padding, this.dim[1] - this.padding);
        this.buffer.background(51);
        this.buffer.translate(this.dim[0] / 2, this.dim[1] / 2);

        p5.textFont('Consolas');
    }

    draw = (p5: p5Types) => {

        p5.clear();

        p5.text('Theta1:    ' + this.props.dp.theta[0].toString().replace(/^(?=\d)/, ' '), 10, 20);
        p5.text('Theta2:    ' + this.props.dp.theta[1].toString().replace(/^(?=\d)/, ' '), 10, 40);
        p5.text('D Theta1:  ' + this.props.dp.dTheta[0].toString().replace(/^(?=\d)/, ' '), 10, 80);
        p5.text('D Theta2:  ' + this.props.dp.dTheta[1].toString().replace(/^(?=\d)/, ' '), 10, 100);
        p5.text('DD Theta1: ' + this.props.dp.ddTheta[0].toString().replace(/^(?=\d)/, ' '), 10, 140);
        p5.text('DD Theta2: ' + this.props.dp.ddTheta[1].toString().replace(/^(?=\d)/, ' '), 10, 160);

        p5.scale(this.dim[0] / this.orgDim[0]);
        p5.translate(this.dim[0] / 2, this.dim[1] / 2);

        let x0 = this.props.dp.x[0];
        let y0 = this.props.dp.y[0];
        let x1 = this.props.dp.x[1];
        let y1 = this.props.dp.y[1];

        if (!this.paused) {


            let px1 = x1;
            let py1 = y1;

            this.props.dp.tick();

            x0 = this.props.dp.x[0];
            y0 = this.props.dp.y[0];
            x1 = this.props.dp.x[1];
            y1 = this.props.dp.y[1];

            // Memory Line/Dots
            if (this.props.memorySettings.drawMode === 'solidLine') {
                p5.translate(-this.dim[0] / 2, -this.dim[1] / 2);
                p5.image(this.buffer, this.padding / 2, this.padding / 2);
                this.buffer.stroke(this.props.memorySettings.drawColor);
                this.buffer.strokeWeight(this.props.memorySettings.strokeWeight);
                if (p5.frameCount > 1) {
                    this.buffer.line(px1 - this.padding / 2, py1 - this.padding / 2, x1 - this.padding / 2, y1 - this.padding / 2);
                }
            } else if (this.props.memorySettings.drawMode === 'dots' || this.props.memorySettings.drawMode === 'fadingLine') {
                let newLength = this.mem.push([x1, y1]);
                if (newLength >= this.props.memorySettings.maxMem) {
                    this.mem.shift();
                }
                this.mem.forEach((e) => {
                    let alpha = 255;
                    if (this.mem.indexOf(e) <= this.props.memorySettings.fadingStart) {
                        alpha = mapRange(this.mem.indexOf(e), 0, this.props.memorySettings.fadingStart, 0, 255)
                    }
                    let color = [this.props.memorySettings.drawColor[0], this.props.memorySettings.drawColor[1], this.props.memorySettings.drawColor[2], alpha]
                    if (this.props.memorySettings.drawMode === 'dots') {
                        p5.fill(color);
                        p5.circle(e[0], e[1], 2);
                    } else {
                        let previous = this.mem.indexOf(e) > 0 ? this.mem[this.mem.indexOf(e) - 1] : e
                        p5.stroke(color);
                        p5.strokeWeight(this.props.memorySettings.strokeWeight);
                        p5.line(previous[0], previous[1], e[0], e[1]);
                    }
                });
            }
        }
        // Legs
        p5.noFill();
        p5.stroke(this.props.pendulumSettings.drawColor);
        p5.strokeWeight(this.props.pendulumSettings.legWeight);
        p5.line(0, 0, x0, y0);
        p5.line(x0, y0, x1, y1);

        // Ankles
        p5.fill(this.props.pendulumSettings.drawColor);
        p5.noStroke();
        p5.circle(0, 0, this.props.pendulumSettings.ankleWidth);
        p5.circle(x0, y0, this.props.pendulumSettings.ankleWidth);
        p5.circle(x1, y1, this.props.pendulumSettings.ankleWidth);
    }

    render() {
        return (
            <Sketch setup={this.setup} draw={this.draw} className="pendulum" />
        );
    }
}