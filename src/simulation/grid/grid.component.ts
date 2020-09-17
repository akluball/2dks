import { Component, Input } from '@angular/core';
import CoordinateConverter, { PositionOnlyViewport } from '../CoordinateConverter';
import { ReadonlyVector } from '../model/vector';

interface LineSegment {
    readonly label: string;
    readonly startX: number;
    readonly startY: number;
    readonly endX: number;
    readonly endY: number;
}

function createLineSegment(label: string,
                           start: ReadonlyVector,
                           end: ReadonlyVector,
                           converter: CoordinateConverter) {
    return {
        label,
        startX: converter.modelToSvgX(start.x),
        startY: converter.modelToSvgY(start.y),
        endX: converter.modelToSvgX(end.x),
        endY: converter.modelToSvgY(end.y),
    };
}

function computeLabel(val: number, spacing: number): string {
    let wholePart = Math.floor(val);
    const decimalParts: number[] = [];
    if (spacing < 1) {
        let remainder = Math.abs(val) % 1;
        let baseTenExponent = -1;
        let powerOfTen = 10 ** baseTenExponent;
        while (powerOfTen > spacing) {
            decimalParts.push(Math.floor(remainder / powerOfTen));
            remainder %= powerOfTen;
            baseTenExponent--;
            powerOfTen = 10 ** baseTenExponent;
        }
        decimalParts.push(Math.round(remainder / powerOfTen));
        let i = decimalParts.length - 1;
        while (i > -1 && decimalParts[i] > 9) {
            if (decimalParts[i] > 10) {
                console.log(decimalParts[i]);
            }
            decimalParts[i] %= 10;
            i--;
            if (i === -1) {
                wholePart++;
            } else {
                decimalParts[i]++;
            }
        }
    }
    if (decimalParts.length) {
        return `${wholePart}.${decimalParts.join('')}`;
    } else {
        return wholePart.toString();
    }
}

@Component({
    selector: '[grid]',
    templateUrl: './grid.component.html',
    styleUrls: [ './grid.component.css' ]
})
export class GridComponent {
    @Input() converter!: CoordinateConverter;
    private modelViewport!: PositionOnlyViewport;
    private spacingBaseTenExponent = 2;
    private _horizontal: LineSegment[] = [];
    private _vertical: LineSegment[] = [];

    private refresh() {
        const current = this.converter.modelViewport;
        if (!this.modelViewport) {
            this.modelViewport = current;
        } else if (this.modelViewport
            && current.left === this.modelViewport.left
            && current.right === this.modelViewport.right
            && current.top === this.modelViewport.top
            && current.bottom === this.modelViewport.top) {
            return;
        }
        this.modelViewport = current;
        this._horizontal.splice(0);
        const { left, right, top, bottom } = this.converter.modelViewport;
        let spacing = 10 ** this.spacingBaseTenExponent;
        const constraint = Math.min(top - bottom, right - left);
        while (constraint / spacing > 30) {
            spacing *= 10;
            this.spacingBaseTenExponent++;
        }
        while (constraint / spacing < 3) {
            spacing /= 10;
            this.spacingBaseTenExponent--;
        }
        let y = Math.ceil(this.modelViewport.bottom / spacing) * spacing;
        while (y < this.modelViewport.top) {
            const start = { x: this.modelViewport.left, y };
            const end = { x: this.modelViewport.right, y };
            this._horizontal.push(createLineSegment(computeLabel(y, spacing), start, end, this.converter));
            y += spacing;
        }
        this._vertical.splice(0);
        let x = Math.ceil(left / spacing) * spacing;
        while (x < right) {
            const start = { x, y: bottom };
            const end = { x, y: top };
            this._vertical.push(createLineSegment(computeLabel(x, spacing), start, end, this.converter));
            x += spacing;
        }
    }

    get horizontal(): LineSegment[] {
        this.refresh();
        return this._horizontal;
    }

    get vertical(): LineSegment[] {
        this.refresh();
        return this._vertical;
    }
}
