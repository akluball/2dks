import { Component, Input, Output, EventEmitter } from '@angular/core';
import ParticleSnapshot from '../model/ParticleSnapshot';

@Component({
    selector: '[particle-component]',
    templateUrl: './particle.component.html',
    styleUrls: [ './particle.component.css' ]
})
export class ParticleComponent {
    @Input() particle!: ParticleSnapshot;
    @Output() circleHover = new EventEmitter<void>();
    @Output() circleDehover = new EventEmitter<void>();
    @Output() circleFocus = new EventEmitter<void>();
    @Output() circleBlur = new EventEmitter<void>();
}
