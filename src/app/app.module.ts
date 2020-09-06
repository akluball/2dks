import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SimulationModule } from '../simulation/simulation.module';

@NgModule({
    imports: [
        BrowserModule,
        SimulationModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
