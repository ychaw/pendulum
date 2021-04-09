import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { DoublePendulum } from "../sim/double-pendulum";

interface ComponentProps {
    dp: DoublePendulum
    continuousLine: boolean
}

export const PendulumVisualization: React.FC<ComponentProps> = (props: ComponentProps) => {

    let mem: number[][] = [];
    let dim: number[] = []
    let buffer: p5Types.Graphics;
    let padding: number = 70;

    let paused: boolean = false;

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        dim = [canvasParentRef.clientWidth, canvasParentRef.clientHeight];
        p5.createCanvas(dim[0], dim[1]).parent(canvasParentRef);

        p5.mouseClicked = (event: any) => {
            paused = !paused;
        }

        p5.windowResized = () => {
            let newWidth = document.getElementsByClassName('FocusCard').item(0)?.clientWidth as number;
            if (newWidth !== dim[0]) {
                dim[0] = newWidth;
                buffer.resizeCanvas(dim[0] - padding, dim[1] - padding, true);
                buffer.translate(dim[0] / 2, dim[1] / 2);
            }
        }

        buffer = p5.createGraphics(dim[0] - padding, dim[1] - padding);
        buffer.background(51);
        buffer.translate(dim[0] / 2, dim[1] / 2);
    };

    const draw = (p5: p5Types) => {

        if (!paused) {

            let px1 = props.dp.x[1];
            let py1 = props.dp.y[1];

            props.dp.tick();

            let x0 = props.dp.x[0];
            let y0 = props.dp.y[0];
            let x1 = props.dp.x[1];
            let y1 = props.dp.y[1];

            p5.clear();

            // Memory Line/Dots
            if (props.continuousLine) {
                p5.image(buffer, padding / 2, padding / 2);
                buffer.stroke(221);
                buffer.strokeWeight(1);
                if (p5.frameCount > 1) {
                    buffer.line(px1 - padding / 2, py1 - padding / 2, x1 - padding / 2, y1 - padding / 2);
                }
            } else {
                let newLength = mem.push([x1, y1]);
                if (newLength > 100) {
                    mem.shift();
                }
                mem.forEach((e) => {
                    p5.fill(221);
                    p5.circle(e[0], e[1], 2);
                });
            }

            p5.translate(dim[0] / 2, dim[1] / 2);

            // Legs
            p5.noFill();
            p5.stroke(255);
            p5.strokeWeight(4);
            p5.line(0, 0, x0, y0);
            p5.line(x0, y0, x1, y1);

            // Ankles
            p5.fill(255);
            p5.noStroke();
            p5.circle(0, 0, 10);
            p5.circle(x0, y0, 10);
            p5.circle(x1, y1, 10);
        };
    };

    return <Sketch setup={setup} draw={draw} className="pendulum" />;
};