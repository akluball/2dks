import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SimulationService } from './simulation.service';
import { SimulationComponent } from './simulation.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ParticleComponent } from './particle/particle.component';
import { ParticleDescriptionComponent } from './particle/description/particle-description.component';

@NgModule({
    declarations: [
        SimulationComponent,
        ToolbarComponent,
        ParticleComponent,
        ParticleDescriptionComponent
    ],
    imports: [ BrowserModule ],
    exports: [
        SimulationComponent
    ],
    providers: [ SimulationService ]
})
export class SimulationModule {
}
