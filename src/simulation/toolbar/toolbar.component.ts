import {
    Component,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    NgZone,
    Renderer2,
    ChangeDetectorRef,
    Input
} from '@angular/core';
import CollisionSimulator from '../model/CollisionSimulator';
import GravitySimulator from '../model/GravitySimulator';
import * as symbol from '../../symbol';

export enum Action {
    ADD_PARTICLE = 'add-particle',
    ZOOM_PAN = 'zoom-pan'
}

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: [ './toolbar.component.css' ]
})
export class ToolbarComponent implements AfterViewInit, OnDestroy {
    @ViewChild('content') content!: ElementRef<HTMLElement>;
    @Input() action!: Action;
    @Output() actionChange = new EventEmitter<Action>();
    @Input() gravitySimulator!: GravitySimulator;
    @Output() gravitySimulatorChange = new EventEmitter<GravitySimulator>();
    @Input() gravitationalConstant!: number;
    @Output() gravitationalConstantChange = new EventEmitter<number>();
    @Input() collisionSimulator!: CollisionSimulator;
    @Output() collisionSimulatorChange = new EventEmitter<CollisionSimulator>();
    @Output() undo = new EventEmitter<void>();
    @Output() redo = new EventEmitter<void>();
    @Output() step = new EventEmitter<void>();
    @Output('showGrid') showGridChange = new EventEmitter<boolean>();
    @Output('showTracker') showTrackerChange = new EventEmitter<boolean>();

    readonly symbol = symbol;
    Action = Action;
    GravitySimulator = GravitySimulator;
    CollisionSimulator = CollisionSimulator;

    visible = true;
    showGrid = false;
    showTracker = false;

    private scrollReference: number | undefined;
    private unlisten: { (): void } | undefined;

    constructor(private zone: NgZone,
        private renderer: Renderer2,
        private changeDetector: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            this.unlisten = this.renderer.listen(this.content.nativeElement,
                                                 'mousemove',
                                                 (e: MouseEvent) => {
                                                     this.scroll(e.clientX);
                                                 });
        });
    }

    ngOnDestroy(): void {
        if (this.unlisten) {
            this.unlisten();
        }
    }

    startScroll(x: number): void {
        this.scrollReference = x;
    }

    scroll(x: number): void {
        if (this.scrollReference) {
            this.content.nativeElement.scrollLeft += this.scrollReference - x;
            this.scrollReference = x;
            this.changeDetector.detectChanges();
        }
    }

    endScroll(): void {
        this.scrollReference = undefined;
    }
}
