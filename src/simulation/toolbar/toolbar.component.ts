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
    ChangeDetectorRef
} from '@angular/core';
import Action from './Action';
import * as symbol from '../../symbol';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: [ './toolbar.component.css' ]
})
export class ToolbarComponent implements AfterViewInit, OnDestroy {
    @ViewChild('content') content!: ElementRef<HTMLElement>;
    @Output() actionSelect = new EventEmitter<string>();
    @Output() undo = new EventEmitter<void>();
    @Output() redo = new EventEmitter<void>();
    @Output() step = new EventEmitter<void>();
    @Output('showGrid') showGridChange = new EventEmitter<boolean>();
    @Output('showTracker') showTrackerChange = new EventEmitter<boolean>();

    readonly symbol = symbol;
    visible = true;
    Action = Action;
    showGrid = false;
    showTracker = false;

    private scrollReference: number | undefined;
    private unlisten: { (): void } | undefined;

    constructor(private zone: NgZone,
        private renderer: Renderer2,
        private changeDetector: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        this.actionSelect.emit(Action.ADD_PARTICLE);
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
