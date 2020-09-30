import { Vector } from './model/geometry';

interface Viewport {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
}

export interface PositionOnlyViewport {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
}

export class SvgViewport implements Viewport {
    constructor(private svg: SVGSVGElement) {
    }

    get left(): number {
        return this.svg.x.baseVal.value;
    }

    get top(): number {
        return this.svg.y.baseVal.value;
    }

    get width(): number {
        return this.svg.width.baseVal.value;
    }

    get height(): number {
        return this.svg.height.baseVal.value;
    }
}

// converts between 3 coordinate systems
// client viewport (right-hand)
// svg viewport (right-hand)
// model coordinate system (left-hand)
class CoordinateConverter {
    private svgViewport: Viewport;
    private modelZoom = 1;
    private modelTranslate: Vector = { x: 0, y: 0 };

    constructor() {
        this.svgViewport = { left: 0, top: 0, width: 0, height: 0 };
    }

    setSvgViewport(svgViewport: Viewport): void {
        this.svgViewport = svgViewport;
    }

    get modelViewport(): PositionOnlyViewport {
        return {
            left: this.svgToModelX(0),
            right: this.svgToModelX(this.svgViewport.width),
            top: this.svgToModelY(0),
            bottom: this.svgToModelY(this.svgViewport.height)
        };
    }

    get widthCorrection(): number {
        return -this.svgViewport.width * (this.modelZoom - 1) / 2;
    }

    get heightCorrection(): number {
        return -this.svgViewport.height * (this.modelZoom - 1) / 2;
    }

    get modelToSvgTransform(): string {
        return `translate(0, ${this.svgViewport.height}) \
                scale(1, -1) \
                translate(${this.widthCorrection}, ${this.heightCorrection}) \
                scale(${this.modelZoom}, ${this.modelZoom}) \
                translate(${this.modelTranslate.x}, ${this.modelTranslate.y})`;
    }

    modelToSvgX(x: number): number {
        return (x + this.modelTranslate.x) * this.modelZoom + this.widthCorrection;
    }

    modelToSvgY(y: number): number {
        return -((y + this.modelTranslate.y) * this.modelZoom + this.heightCorrection) + this.svgViewport.height;
    }

    svgToModelX(x: number): number {
        return (x - this.widthCorrection) / this.modelZoom - this.modelTranslate.x;
    }

    svgToModelY(y: number): number {
        return ((-y + this.svgViewport.height  - this.heightCorrection) / this.modelZoom) - this.modelTranslate.y;
    }

    svgToModel(v: Vector): Vector {
        return {
            x: this.svgToModelX(v.x),
            y: this.svgToModelY(v.y)
        };
    }

    clientToSvg(v: Vector): Vector {
        return {
            x: v.x - this.svgViewport.left,
            y: v.y - this.svgViewport.top
        };
    }

    clientToModel(v: Vector): Vector {
        return this.svgToModel(this.clientToSvg(v));
    }

    pan(clientStart: Vector, clientEnd: Vector): void {
        const start = this.clientToModel(clientStart);
        const end = this.clientToModel(clientEnd);
        this.modelTranslate.x += end.x - start.x;
        this.modelTranslate.y += end.y - start.y;
    }

    zoomIn(): void {
        this.modelZoom *= 11 / 10;
    }

    zoomOut(): void {
        this.modelZoom *= 10 / 11;
    }
}

export default CoordinateConverter;
