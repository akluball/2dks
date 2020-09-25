import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

const floatRegex = /^[-+]?(\d+\.?\d*)|(\d*\.?\d+)$/;

@Component({
    selector: 'number-edit',
    templateUrl: './number-edit.component.html',
    styleUrls: [ './number-edit.component.css' ]
})
export class NumberEditComponent implements OnInit{
    @Input() value!: number;
    @Output() edit = new EventEmitter<number>();
    width = 0;
    animation = 'none';

    ngOnInit(): void {
        this.width = this.value.toString().length;
    }

    emitEdit(asString: string): void {
        if (floatRegex.test(asString)) {
            const edit = parseFloat(asString);
            if (edit === this.value) {
                return;
            }
            this.animation = 'none';
            this.edit.emit(edit);
        }
    }

    onEditSuccess(): void {
        this.animation = '500ms alternate 2 on-edit';
    }
}
