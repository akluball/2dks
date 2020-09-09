import { Component, Output, EventEmitter } from '@angular/core';
import * as symbol from '../../symbol';
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
    @Output() step = new EventEmitter<void>();

    readonly symbol = symbol;
    visible = true;
    Action = Action;

    get arrow(): string {
        return this.visible ? symbol.LEFT_ARROW : symbol.RIGHT_ARROW;
    }

    toggle(): void {
        if (this.visible) {
            this.visible = false;
        } else {
            this.visible = true;
        }
    }
}
