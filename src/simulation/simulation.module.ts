import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SimulationService } from './simulation.service';
import { SimulationComponent } from './simulation.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { GridComponent } from './grid/grid.component';
import { MouseTrackerComponent } from './mouse-tracker/mouse-tracker.component';
import { ParticleComponent } from './particle/particle.component';
import { ParticleDescriptionComponent } from './particle/description/particle-description.component';
import { NumberEditComponent } from './number-edit/number-edit.component';

@NgModule({
    declarations: [
        SimulationComponent,
        ToolbarComponent,
        GridComponent,
        MouseTrackerComponent,
        ParticleComponent,
        ParticleDescriptionComponent,
        NumberEditComponent
    ],
    imports: [ BrowserModule ],
    exports: [
        SimulationComponent
    ],
    providers: [ SimulationService ]
})
export class SimulationModule {
}
