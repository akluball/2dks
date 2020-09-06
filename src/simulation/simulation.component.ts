import { Component, HostListener, HostBinding, ElementRef, ViewChild } from '@angular/core';
import { SimulationService } from './simulation.service';
import Action from './toolbar/Action';
import Vector, { distanceBetween } from './model/Vector';
import ReadonlyParticle from './model/ReadonlyParticle';

interface PendingParticle {
    cx: number;
    cy: number;
    r: number;
    radiusLimit: number;
    fill: string;
}

@Component({
    selector: 'simulation',
    templateUrl: './simulation.component.html',
    styleUrls: [ './simulation.component.css' ]
})
export class SimulationComponent {
    @HostBinding('attr.tabindex') readonly tabindex = 0;
    @ViewChild('svg') svg!: ElementRef<SVGSVGElement>;
    action = '';
    pendingParticle: PendingParticle | undefined;
    described: ReadonlyParticle | undefined;
    circleHover = false;
    circleFocus = false;
    descriptionHover = false;
    descriptionFocus = false;

    constructor(public service: SimulationService) {
    }

    private toSvgX(x: number) {
        return x - this.svg.nativeElement.getBoundingClientRect().left;
    }

    private toSvgY(y: number) {
        const { top, height } = this.svg.nativeElement.getBoundingClientRect();
        return -y + top + height;
    }

    @HostListener('window:resize')
    noOp(): void { // eslint-disable-next-line no-empty
    }

    @HostListener('keydown.control.z')
    undo(): void {
        this.service.undo();
    }

    @HostListener('keydown.control.shift.Z')
    redo(): void {
        this.service.redo();
    }

    onCircleHover(particle: ReadonlyParticle): void {
        if (!this.pendingParticle && !this.circleFocus && !this.descriptionFocus) {
            this.circleHover = true;
            this.described = particle;
        }
    }

    onCircleDehover(particle: ReadonlyParticle): void {
        setTimeout(() => {
            if (particle === this.described) {
                this.circleHover = false;
                if (!(this.circleFocus || this.descriptionHover || this.descriptionFocus)) {
                    this.described = undefined;
                }
            }
        }, 0);
    }

    onCircleFocus(particle: ReadonlyParticle): void {
        if (!this.pendingParticle) {
            this.circleFocus = true;
            this.described = particle;
        }
    }

    onCircleBlur(particle: ReadonlyParticle): void {
        setTimeout(() => {
            if (particle === this.described) {
                this.circleFocus = false;
                if (!(this.circleFocus || this.descriptionHover || this.descriptionFocus)) {
                    this.described = undefined;
                }
            }
        }, 0);
    }

    onPress(target: Element, { x, y }: Vector): void {
        switch (this.action) {
            case Action.ADD_PARTICLE: {
                if (target !== this.svg.nativeElement) {
                    break;
                }
                x = this.toSvgX(x);
                y = this.toSvgY(y);
                const radiusLimit = this.service.distanceToClosest({ x, y });
                const fill = radiusLimit === 0 ? 'red' : 'lightgray';
                this.pendingParticle = { cx: x, cy: y, r: 0, fill, radiusLimit };
                break;
            }
        }
    }

    onMove({ x, y }: Vector): void {
        switch (this.action) {
            case Action.ADD_PARTICLE: {
                if (!this.pendingParticle) {
                    break;
                }
                x = this.toSvgX(x);
                y = this.toSvgY(y);
                this.pendingParticle.r = distanceBetween({ x: this.pendingParticle.cx, y: this.pendingParticle.cy },
                                                         { x, y });
                this.pendingParticle.fill = this.pendingParticle.r < this.pendingParticle.radiusLimit
                    ? 'lightgray'
                    : 'red';
                break;
            }
        }
    }

    onRelease(coordinates: Vector): void {
        switch (this.action) {
            case Action.ADD_PARTICLE: {
                if (!this.pendingParticle) {
                    break;
                }
                this.onMove(coordinates);
                const { cx, cy, r } = this.pendingParticle;
                this.service.createParticle(cx, cy, r);
                this.pendingParticle = undefined;
            }
        }
    }

    onLeave(): void {
        this.pendingParticle = undefined;
    }
}
