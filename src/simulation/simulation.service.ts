import { Injectable } from '@angular/core';
import Undo from './history/Undo';
import Redo from './history/Redo';
import { HistoryBuilder } from './history/History';
import ReadonlyParticle from './model/ReadonlyParticle';
import Simulation from './model/Simulation';
import Vector from './model/Vector';
import Particle from './model/Particle';

class ReadonlyParticleImpl implements ReadonlyParticle {
    constructor(readonly particle: Particle) {
    }

    get x(): number {
        return this.particle.position.x;
    }

    get y(): number {
        return this.particle.position.y;
    }

    get radius(): number {
        return this.particle.radius;
    }
}

@Injectable()
export class SimulationService {
    private undos: Undo[] = [];
    private redos: Redo[] = [];
    private simulation = new Simulation();
    private _readonlyParticles: ReadonlyParticle[] = [];

    get readonlyParticles(): ReadonlyArray<ReadonlyParticle> {
        return this._readonlyParticles;
    }

    undo(): void {
        const redo = this.undos.pop()?.undo();
        if (redo) {
            this.redos.push(redo);
        }
    }

    redo(): void {
        const undo = this.redos.pop()?.redo();
        if (undo) {
            this.undos.push(undo);
        }
    }

    createParticle(cx: number, cy: number, r: number): void {
        const particle = this.simulation.createParticle(cx, cy, r);
        if (!particle) {
            return undefined;
        } else {
            const readonlyParticle = new ReadonlyParticleImpl(particle);
            this._readonlyParticles.push(readonlyParticle);
            const undo = new HistoryBuilder()
                                             .undoAction(this.removeParticle.bind(this, readonlyParticle))
                                             .redoAction(this.addParticle.bind(this, readonlyParticle))
                                             .build();
            this.undos.push(undo);
        }
    }

    private removeParticle(readonlyParticle: ReadonlyParticle): void;
    private removeParticle(readonlyParticle: ReadonlyParticleImpl): void {
        const i = this._readonlyParticles.indexOf(readonlyParticle);
        if (i !== -1) {
            this._readonlyParticles.splice(i, 1);
        }
        this.simulation.removeParticle(readonlyParticle.particle);
    }

    private addParticle(readonlyParticle: ReadonlyParticle): void;
    private addParticle(readonlyParticle: ReadonlyParticleImpl): void {
        this._readonlyParticles.push(readonlyParticle);
        this.simulation.addParticle(readonlyParticle.particle);
    }

    distanceToClosest(v: Vector): number {
        return this.simulation.distanceToClosest(v);
    }

    setPositionX(readonlyParticle: ReadonlyParticle, x: number): void;
    setPositionX({ particle }: ReadonlyParticleImpl, x: number): void {
        if (this.simulation.isValidPositionX(particle, x)) {
            const previous = particle.position.x;
            const undo = new HistoryBuilder()
                                             .undoAction(() => {
                                                 particle.position.x = previous;
                                             })
                                             .redoAction(() => {
                                                 particle.position.x = x;
                                             })
                                             .build();
            particle.position.x = x;
            this.undos.push(undo);
        }
    }

    setPositionY(readonlyParticle: ReadonlyParticle, y: number): void;
    setPositionY({ particle }: ReadonlyParticleImpl, y: number): void {
        if (this.simulation.isValidPositionY(particle, y)) {
            const previous = particle.position.y;
            const undo = new HistoryBuilder()
                                             .undoAction(() => {
                                                 particle.position.y = previous;
                                             })
                                             .redoAction(() => {
                                                 particle.position.y = y;
                                             })
                                             .build();
            particle.position.y = y;
            this.undos.push(undo);
        }
    }

    setRadius(readonlyParticle: ReadonlyParticle, radius: number): void;
    setRadius({ particle }: ReadonlyParticleImpl, radius: number): void {
        if (this.simulation.isValidRadius(particle, radius)) {
            const previous = particle.radius;
            const undo = new HistoryBuilder()
                                             .undoAction(() => {
                                                 particle.radius = previous;
                                             })
                                             .redoAction(() => {
                                                 particle.radius = radius;
                                             })
                                             .build();
            particle.radius = radius;
            this.undos.push(undo);
        }
    }
}
