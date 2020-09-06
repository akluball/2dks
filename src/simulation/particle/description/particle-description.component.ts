import { Component, Input, HostBinding } from '@angular/core';
import { SimulationService } from '../../simulation.service';
import ReadonlyParticle from '../../model/ReadonlyParticle';

const floatRegex = /^[-+]?\d+.?\d*$/;

@Component({
    selector: 'particle-description',
    templateUrl: './particle-description.component.html',
    styleUrls: [ './particle-description.component.css' ]
})
export class ParticleDescriptionComponent {
    @HostBinding('attr.tabindex') readonly tabindex = 0;
    @Input() particle!: ReadonlyParticle;
    @Input() focus!: boolean;

    constructor(private service: SimulationService) {
    }

    private isFloat(asString: string): boolean {
        return floatRegex.test(asString);
    }

    setPositionX(asString: string): void {
        if (this.isFloat(asString)) {
            this.service.setPositionX(this.particle, parseFloat(asString));
        }
    }

    setPositionY(asString: string): void {
        if (this.isFloat(asString)) {
            this.service.setPositionY(this.particle, parseFloat(asString));
        }
    }

    setRadius(asString: string): void {
        if (this.isFloat(asString)) {
            const radius = Math.abs(parseFloat(asString));
            if (radius === 0) {
                return;
            }
            this.service.setRadius(this.particle, radius);
        }
    }
}
