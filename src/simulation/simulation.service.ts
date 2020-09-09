import { Injectable } from '@angular/core';
import History from './history/History';
import { UndoRedoBuilder } from './history/UndoRedo';
import ParticleSnapshot from './model/ParticleSnapshot';
import Simulation from './model/Simulation';
import Vector, { distanceBetween } from './model/Vector';

@Injectable()
export class SimulationService {
    private history = new History();
    private simulation = new Simulation();
    private particleSnapshots: ParticleSnapshot[] = [];

    get particles(): ReadonlyArray<ParticleSnapshot> {
        return this.particleSnapshots;
    }

    undo(): void {
        this.history.undo();
    }

    redo(): void {
        this.history.redo();
    }

    step(): void {
        this.simulation.step();
        const undo = new UndoRedoBuilder()
                                          .undoAction(this.simulation.stepBack.bind(this.simulation))
                                          .redoAction(this.simulation.step.bind(this.simulation))
                                          .build();
        this.history.appendUndo(undo);
    }

    createParticle(cx: number, cy: number, r: number): void {
        const particle = this.simulation.createParticle(cx, cy, r);
        if (!particle) {
            return;
        }
        this.particleSnapshots.push(particle);
        const undo = new UndoRedoBuilder()
                                          .undoAction(this.removeParticle.bind(this, particle))
                                          .redoAction(this.addParticle.bind(this, particle))
                                          .build();
        this.history.appendUndo(undo);
    }

    private addParticle(particle: ParticleSnapshot): void {
        this.particleSnapshots.push(particle);
        this.simulation.addParticle(particle);
    }

    private removeParticle(particle: ParticleSnapshot): void {
        const i = this.particleSnapshots.indexOf(particle);
        if (i !== -1) {
            this.particleSnapshots.splice(i, 1);
        }
        this.simulation.removeParticle(particle);
    }

    distanceToClosest(position: Vector): number {
        let distance = Infinity;
        for (const particle of this.particleSnapshots) {
            const otherPosition = { x: particle.positionX, y: particle.positionY };
            const d = distanceBetween(position, otherPosition) - particle.radius;
            if (d < distance) {
                distance = d;
            }
        }
        return distance;
    }

    setPositionX(particle: ParticleSnapshot, x: number): void {
        if (this.simulation.isValidPositionX(particle, x)) {
            const previous = particle.positionX;
            const undo = new UndoRedoBuilder()
                                              .undoAction(() => {
                                                  this.simulation.setPositionX(particle, previous);
                                              })
                                              .redoAction(() => {
                                                  this.simulation.setPositionX(particle, x);
                                              })
                                              .build();
            this.simulation.setPositionX(particle, x);
            this.history.appendUndo(undo);
        }
    }

    setPositionY(particle: ParticleSnapshot, y: number): void {
        if (this.simulation.isValidPositionY(particle, y)) {
            const previous = particle.positionY;
            const undo = new UndoRedoBuilder()
                                              .undoAction(() => {
                                                  this.simulation.setPositionY(particle, previous);
                                              })
                                              .redoAction(() => {
                                                  this.simulation.setPositionY(particle, y);
                                              })
                                              .build();
            this.simulation.setPositionY(particle, y);
            this.history.appendUndo(undo);
        }
    }

    setRadius(particle: ParticleSnapshot, radius: number): void {
        if (this.simulation.isValidRadius(particle, radius)) {
            const previous = particle.radius;
            const undo = new UndoRedoBuilder()
                                              .undoAction(() => {
                                                  this.simulation.setRadius(particle, previous);
                                              })
                                              .redoAction(() => {
                                                  this.simulation.setRadius(particle, radius);
                                              })
                                              .build();
            this.simulation.setRadius(particle, radius);
            this.history.appendUndo(undo);
        }
    }

    setVelocityX(particle: ParticleSnapshot, velocityX: number): void {
        const previous = particle.velocityX;
        this.simulation.setVelocityX(particle, velocityX);
        const undo = new UndoRedoBuilder()
                                          .undoAction(() => {
                                              this.simulation.setVelocityX(particle, previous);
                                          })
                                          .redoAction(() => {
                                              this.simulation.setVelocityX(particle, velocityX);
                                          })
                                          .build();
        this.history.appendUndo(undo);
    }

    setVelocityY(particle: ParticleSnapshot, velocityY: number): void {
        const previous = particle.velocityY;
        this.simulation.setVelocityY(particle, velocityY);
        const undo = new UndoRedoBuilder()
                                          .undoAction(() => {
                                              this.simulation.setVelocityY(particle, previous);
                                          })
                                          .redoAction(() => {
                                              this.simulation.setVelocityY(particle, velocityY);
                                          })
                                          .build();
        this.history.appendUndo(undo);
    }
}
