import { Component, Input, HostBinding } from '@angular/core';
import { SimulationService } from '../../simulation.service';
import ParticleSnapshot from '../../model/ParticleSnapshot';
import * as symbol from '../../../symbol';
import { NumberEditComponent } from 'src/simulation/number-edit/number-edit.component';

@Component({
    selector: 'particle-description',
    templateUrl: './particle-description.component.html',
    styleUrls: [ './particle-description.component.css' ]
})
export class ParticleDescriptionComponent {
    @HostBinding('attr.tabindex') readonly tabindex = 0;
    @Input() particle!: ParticleSnapshot;
    @Input() focus!: boolean;
    symbol = symbol;

    Number = Number;

    constructor(private service: SimulationService) {
    }

    setPositionX(positionX: number, numberEdit: NumberEditComponent): void {
        this.service.setPositionX(this.particle, positionX);
        if (this.particle.positionX === positionX) {
            numberEdit.onEditSuccess();
        }
    }

    setPositionY(positionY: number, numberEdit: NumberEditComponent): void {
        this.service.setPositionY(this.particle, positionY);
        if (this.particle.positionY === positionY) {
            numberEdit.onEditSuccess();
        }
    }

    setRadius(radius: number, numberEdit: NumberEditComponent): void {
        if (radius !== 0) {
            this.service.setRadius(this.particle, Math.abs(radius));
            if (this.particle.radius === radius) {
                numberEdit.onEditSuccess();
            }
        }
    }

    setVelocityX(velocityX: number, numberEdit: NumberEditComponent): void {
        this.service.setVelocityX(this.particle, velocityX);
        if (this.particle.velocityX === velocityX) {
            numberEdit.onEditSuccess();
        }
    }

    setVelocityY(velocityY: number, numberEdit: NumberEditComponent): void {
        this.service.setVelocityY(this.particle, velocityY);
        if (this.particle.velocityY === velocityY) {
            numberEdit.onEditSuccess();
        }
    }

    setMass(mass: number, massEdit: NumberEditComponent): void {
        this.service.setMass(this.particle, mass);
        if (this.particle.mass === mass) {
            massEdit.onEditSuccess();
        }
    }
}
