import { Component, Output, EventEmitter } from '@angular/core';
import { LEFT_ARROW, RIGHT_ARROW, UNDO, REDO } from '../../symbol';
import Action from './Action';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: [ './toolbar.component.css' ]
})
export class ToolbarComponent {
    @Output() actionSelect = new EventEmitter<string>();
    @Output() undo = new EventEmitter<void>();
    @Output() redo = new EventEmitter<void>();

    visible = true;
    Action = Action;
    undoSymbol = UNDO;
    redoSymbol = REDO;

    get arrow(): string {
        return this.visible ? LEFT_ARROW : RIGHT_ARROW;
    }

    toggle(): void {
        if (this.visible) {
            this.visible = false;
        } else {
            this.visible = true;
        }
    }
}
