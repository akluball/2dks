import { Component, ChangeDetectorRef } from '@angular/core';
import { Vector } from '../model/vector';

const unneccesaryFractionPartRegex = /\.?0{1,5}$/;

@Component({
    selector: 'mouse-tracker',
    templateUrl: './mouse-tracker.component.html'
})
export class MouseTrackerComponent {
    x = '0';
    y = '0';
    mouseModelCoordinates: Vector = { x: 0, y: 0 };

    constructor(private changeDetector: ChangeDetectorRef) {
    }

    setMouseModelCoordinates(mouseModelCoordinates: Vector): void {
        this.x = mouseModelCoordinates.x.toFixed(5).replace(unneccesaryFractionPartRegex, '');
        this.y = mouseModelCoordinates.y.toFixed(5).replace(unneccesaryFractionPartRegex, '');
        this.changeDetector.detectChanges();
    }
}
