import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    HostBinding,
    ViewChild,
    NgZone,
    OnDestroy,
    Renderer2,
    ChangeDetectorRef,
    QueryList,
    forwardRef,
    ViewChildren
} from '@angular/core';
import { SimulationService } from './simulation.service';
import { MouseTrackerComponent } from './mouse-tracker/mouse-tracker.component';
import { Action } from './toolbar/toolbar.component';
import CoordinateConverter, { SvgViewport } from './CoordinateConverter';
import GravitySimulator from './model/GravitySimulator';
import ParticleSnapshot from './model/ParticleSnapshot';
import { ReadonlyVector, distanceBetween } from './model/geometry';
import { nextTick } from '../util';
import CollisionSimulator from './model/CollisionSimulator';

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
export class SimulationComponent implements AfterViewInit, OnDestroy {
    @HostBinding('attr.tabindex') readonly tabindex = 0;
    @ViewChild('svg') svg!: ElementRef<SVGSVGElement>;
    @ViewChildren(forwardRef(() => MouseTrackerComponent)) mouseTrackers!: QueryList<MouseTrackerComponent>;

    readonly converter = new CoordinateConverter();
    action = Action.ADD_PARTICLE;
    showGrid = false;
    showTracker = false;
    pendingParticle: PendingParticle | undefined;
    described: ParticleSnapshot | undefined;
    circleHover = false;
    circleFocus = false;
    descriptionFocus = false;
    panReference: ReadonlyVector | undefined;

    private unlistens: { (): void }[]  = [];

    constructor(private service: SimulationService,
        private zone: NgZone,
        private renderer: Renderer2,
        private changeDetector: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        this.converter.setSvgViewport(new SvgViewport(this.svg.nativeElement));
        this.zone.runOutsideAngular(() => {
            this.unlistens.push(this.renderer.listen(this.svg.nativeElement,
                                                     'mousemove',
                                                     this.onMove.bind(this)));
        });
    }

    ngOnDestroy(): void {
        this.unlistens.forEach(unlisten => {
            unlisten();
        });
    }

    get particles(): ReadonlyArray<ParticleSnapshot> {
        return this.service.particles;
    }

    get gravitySimulator(): GravitySimulator {
        return this.service.gravitySimulator;
    }

    set gravitySimulator(gravitySimulator: GravitySimulator) {
        this.service.gravitySimulator = gravitySimulator;
    }

    get gravitationalConstant(): number {
        return this.service.gravitationalConstant;
    }

    set gravitationalConstant(gravitationalConstant: number) {
        this.service.gravitationalConstant = gravitationalConstant;
    }

    get collisionSimulator(): CollisionSimulator {
        return this.service.collisionSimulator;
    }

    set collisionSimulator(collisionSimulator: CollisionSimulator) {
        this.service.collisionSimulator = collisionSimulator;
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

    step(): void {
        this.service.step();
    }

    onCircleHover(particle: ParticleSnapshot): void {
        if (this.panReference || this.pendingParticle) {
            return;
        }
        if (!(this.circleFocus || this.descriptionFocus)) {
            this.circleHover = true;
            this.described = particle;
        }
    }

    onCircleDehover(particle: ParticleSnapshot): void {
        nextTick(() => {
            if (particle === this.described) {
                this.circleHover = false;
                if (!(this.circleFocus || this.descriptionFocus)) {
                    this.described = undefined;
                }
            }
        });
    }

    onCircleFocus(particle: ParticleSnapshot): void {
        if (!this.pendingParticle) {
            this.circleFocus = true;
            this.described = particle;
        }
    }

    onCircleBlur(particle: ParticleSnapshot): void {
        nextTick(() => {
            if (particle === this.described) {
                this.circleFocus = false;
                if (!(this.circleFocus || this.descriptionFocus || this.circleHover)) {
                    this.described = undefined;
                }
            }
        });
    }

    private pressTagFilter = [ 'svg', 'line', 'text' ];

    onPress(target: Element, v: ReadonlyVector): void {
        if (!this.pressTagFilter.includes(target.tagName)) {
            return;
        }
        switch (this.action) {
            case Action.ADD_PARTICLE: {
                const center = this.converter.clientToModel(v);
                const radiusLimit = this.service.distanceToClosest(center);
                this.pendingParticle = { cx: center.x, cy: center.y, r: 0, fill: 'gray', radiusLimit };
                break;
            }
            case Action.ZOOM_PAN: {
                this.panReference = v;
            }
        }
    }

    onMove(v: ReadonlyVector): void {
        this.refreshMouseTracker(v);
        switch (this.action) {
            case Action.ADD_PARTICLE: {
                if (!this.pendingParticle) {
                    break;
                }
                const center = this.converter.clientToModel(v);
                this.pendingParticle.r = distanceBetween({ x: this.pendingParticle.cx, y: this.pendingParticle.cy },
                                                         center);
                this.pendingParticle.fill = this.pendingParticle.r < this.pendingParticle.radiusLimit
                    ? 'gray'
                    : 'red';
                this.changeDetector.detectChanges();
                break;
            }
            case Action.ZOOM_PAN: {
                if (this.panReference) {
                    this.converter.pan(this.panReference, v);
                    this.panReference = v;
                    this.changeDetector.detectChanges();
                }
            }
        }
    }

    onRelease(coordinates: ReadonlyVector): void {
        switch (this.action) {
            case Action.ADD_PARTICLE: {
                if (!this.pendingParticle) {
                    break;
                }
                this.onMove(coordinates);
                const { cx, cy, r } = this.pendingParticle;
                this.service.createParticle(cx, cy, r);
                this.pendingParticle = undefined;
                break;
            }
            case Action.ZOOM_PAN: {
                this.panReference = undefined;
                break;
            }
        }
    }

    onWheel(v: ReadonlyVector, dy: number): void {
        this.refreshMouseTracker(v);
        if (this.action === Action.ZOOM_PAN) {
            if (dy < 0) {
                this.converter.zoomIn();
                this.changeDetector.detectChanges();
            } else if (dy > 0) {
                this.converter.zoomOut();
                this.changeDetector.detectChanges();
            }
        }
    }

    onLeave(): void {
        this.pendingParticle = undefined;
        this.panReference = undefined;
    }

    private refreshMouseTracker(v: ReadonlyVector): void {
        this.mouseTrackers.forEach(mouseTracker => {
            mouseTracker.setMouseModelCoordinates(this.converter.clientToModel(v));
        });
    }

}
