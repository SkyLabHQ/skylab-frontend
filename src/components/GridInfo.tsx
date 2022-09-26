import React, { FC, useEffect } from "react";

type Props = {
    canvasId: string;
};

class FuncDraw {
    private cw;
    private ch;
    private ctx;
    private step = 0.01;

    constructor(canvas: HTMLCanvasElement) {
        this.cw = canvas.width;
        this.ch = canvas.height;
        this.ctx = canvas.getContext("2d");
    }

    setConfig(s: number) {
        this.step = s;
    }

    clear() {
        this.ctx?.clearRect(0, 0, this.cw, this.ch);
    }

    setColor(
        stroke: CanvasFillStrokeStyles["strokeStyle"],
        fill: CanvasFillStrokeStyles["fillStyle"],
    ) {
        this.ctx!.strokeStyle = stroke;
        this.ctx!.fillStyle = fill;
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.ctx?.moveTo(x1, this.ch - y1);
        this.ctx?.lineTo(x2, this.ch - y2);
        this.ctx?.stroke();
    }

    drawPoint(x: number, y: number) {
        this.ctx?.fillRect(x, this.ch - y, 1, 1);
    }

    drawCoords() {
        this.drawLine(0, 0, this.cw, 0);
        this.drawLine(0, 0, 0, this.ch);
    }

    drawFx(f: (x: number) => number, scaleX: number, scaleY: number) {
        for (let x = 0; x < this.cw; x += this.step) {
            this.drawPoint(x, f(x * scaleX) * scaleY);
        }
    }
}

export const GridInfo: FC<Props> = ({ canvasId }) => {
    useEffect(() => {
        const canvas = document.getElementById(
            canvasId,
        ) as HTMLCanvasElement | null;
        if (!canvas) {
            return;
        }
        const c1 = new FuncDraw(canvas);
        c1.setColor("lightgrey", "red");
        c1.drawCoords();
        c1.drawFx((x) => 5 / (1 + Math.pow(Math.E, -0.2 * (x - 1))), 1, 10);
    }, []);
    return <canvas id={canvasId} width="200" height="200"></canvas>;
};
