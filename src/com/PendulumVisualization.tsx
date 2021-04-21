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

export const PendulumVisualization: React.FC<ComponentProps> = (props: ComponentProps) => {

    let mem: number[][] = [];
    let orgDim: number[] = [];
    let dim: number[] = [];
    let buffer: p5Types.Graphics;
    let padding: number = 70;

    let paused: boolean = true;

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        dim = [canvasParentRef.clientWidth, canvasParentRef.clientHeight];
        orgDim = dim;
        let cnv = p5.createCanvas(dim[0], dim[1], 'p2d').parent(canvasParentRef);

        cnv.doubleClicked((event) => {
            paused = !paused;
            mem = [];
            props.canvasDoubleClicked(paused);
        })

        p5.windowResized = () => {
            let newWidth = document.getElementsByClassName('FocusCard').item(0)?.clientWidth as number;
            let newHeight = document.getElementsByClassName('FocusCard').item(0)?.clientHeight as number;
            if (newWidth !== dim[0] || newHeight !== dim[1]) {
                dim = [newWidth, newHeight];
                p5.resizeCanvas(dim[0], dim[1], true);
                buffer.resizeCanvas(dim[0] - padding, dim[1] - padding, true);
                buffer.translate(dim[0] / 2, dim[1] / 2);
            }
        }

        console.log(props.dp.theta);

        buffer = p5.createGraphics(dim[0] - padding, dim[1] - padding);
        buffer.background(51);
        buffer.translate(dim[0] / 2, dim[1] / 2);

        p5.textFont('Consolas');
    };

    const draw = (p5: p5Types) => {

        p5.clear();

        p5.text('Theta1:    ' + props.dp.theta[0].toString().replace(/^(?=\d)/, ' '), 10, 20);
        p5.text('Theta2:    ' + props.dp.theta[1].toString().replace(/^(?=\d)/, ' '), 10, 40);
        p5.text('D Theta1:  ' + props.dp.dTheta[0].toString().replace(/^(?=\d)/, ' '), 10, 80);
        p5.text('D Theta2:  ' + props.dp.dTheta[1].toString().replace(/^(?=\d)/, ' '), 10, 100);
        p5.text('DD Theta1: ' + props.dp.ddTheta[0].toString().replace(/^(?=\d)/, ' '), 10, 140);
        p5.text('DD Theta2: ' + props.dp.ddTheta[1].toString().replace(/^(?=\d)/, ' '), 10, 160);

        p5.scale(dim[0] / orgDim[0]);
        p5.translate(dim[0] / 2, dim[1] / 2);

        let x0 = props.dp.x[0];
        let y0 = props.dp.y[0];
        let x1 = props.dp.x[1];
        let y1 = props.dp.y[1];

        if (!paused) {

            let px1 = x1;
            let py1 = y1;

            props.dp.tick();

            x0 = props.dp.x[0];
            y0 = props.dp.y[0];
            x1 = props.dp.x[1];
            y1 = props.dp.y[1];

            // Memory Line/Dots
            if (props.memorySettings.drawMode === 'solidLine') {
                p5.translate(-dim[0] / 2, -dim[1] / 2);
                p5.image(buffer, padding / 2, padding / 2);
                buffer.stroke(props.memorySettings.drawColor);
                buffer.strokeWeight(props.memorySettings.strokeWeight);
                if (p5.frameCount > 1) {
                    buffer.line(px1 - padding / 2, py1 - padding / 2, x1 - padding / 2, y1 - padding / 2);
                }
            } else if (props.memorySettings.drawMode === 'dots' || props.memorySettings.drawMode === 'fadingLine') {
                let newLength = mem.push([x1, y1]);
                if (newLength >= props.memorySettings.maxMem) {
                    mem.shift();
                }
                mem.forEach((e) => {
                    let alpha = 255;
                    if (mem.indexOf(e) <= props.memorySettings.fadingStart) {
                        alpha = mapRange(mem.indexOf(e), 0, props.memorySettings.fadingStart, 0, 255)
                    }
                    let color = [props.memorySettings.drawColor[0], props.memorySettings.drawColor[1], props.memorySettings.drawColor[2], alpha]
                    if (props.memorySettings.drawMode === 'dots') {
                        p5.fill(color);
                        p5.circle(e[0], e[1], 2);
                    } else {
                        let previous = mem.indexOf(e) > 0 ? mem[mem.indexOf(e) - 1] : e
                        p5.stroke(color);
                        p5.strokeWeight(props.memorySettings.strokeWeight);
                        p5.line(previous[0], previous[1], e[0], e[1]);
                    }
                });
            }
        }
        // Legs
        p5.noFill();
        p5.stroke(props.pendulumSettings.drawColor);
        p5.strokeWeight(props.pendulumSettings.legWeight);
        p5.line(0, 0, x0, y0);
        p5.line(x0, y0, x1, y1);

        // Ankles
        p5.fill(props.pendulumSettings.drawColor);
        p5.noStroke();
        p5.circle(0, 0, props.pendulumSettings.ankleWidth);
        p5.circle(x0, y0, props.pendulumSettings.ankleWidth);
        p5.circle(x1, y1, props.pendulumSettings.ankleWidth);
    }

    return <Sketch setup={setup} draw={draw} className="pendulum" />;
};