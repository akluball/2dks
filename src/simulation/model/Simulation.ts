import Particle from './Particle';
import { distanceBetween, ReadonlyVector, Vector } from './vector';
import ParticleSnapshot from './ParticleSnapshot';
import GravitySimulator from './GravitySimulator';

interface SimulationClock {
    readonly time: number;
}

class ParticleSnapshotImpl implements ParticleSnapshot {
    constructor(private clock: SimulationClock, readonly particle: Particle) {
    }

    get positionX(): number {
        return this.particle.positionTimeSeries
                            .firstNotAfter(this.clock.time).x;
    }

    get positionY(): number {
        return this.particle.positionTimeSeries
                            .firstNotAfter(this.clock.time).y;
    }

    get radius(): number {
        return this.particle.radius;
    }

    get velocityX(): number {
        return this.particle.velocityTimeSeries
                            .firstNotAfter(this.clock.time).x;
    }

    get velocityY(): number {
        return this.particle.velocityTimeSeries
                            .firstNotAfter(this.clock.time).y;
    }

    get mass(): number {
        return this.particle.mass;
    }
}

class ParticleDelta {
    private positionDelta: Vector = { x: 0, y: 0 };
    private velocityDelta: Vector = { x: 0, y: 0 };

    constructor(readonly particle: Particle) {
    }

    get initialPosition(): ReadonlyVector {
        return this.particle.positionTimeSeries.last;
    }

    get initialVelocity(): ReadonlyVector {
        return this.particle.velocityTimeSeries.last;
    }

    addPositionDelta(delta: ReadonlyVector) {
        this.positionDelta.x += delta.x;
        this.positionDelta.y += delta.y;
    }

    addVelocityDelta(delta: ReadonlyVector) {
        this.velocityDelta.x += delta.x;
        this.velocityDelta.y += delta.y;
    }

    apply(time: number): void {
        const position = {
            x: this.initialPosition.x + this.positionDelta.x,
            y: this.initialPosition.y + this.positionDelta.y
        };
        const velocity = {
            x: this.initialVelocity.x + this.velocityDelta.x,
            y: this.initialVelocity.y + this.velocityDelta.y,
        };
        this.particle.positionTimeSeries.addLast({ time, val: position });
        this.particle.velocityTimeSeries.addLast({ time, val: velocity });
    }
}

function simulateConstantVelocity(deltas: ParticleDelta[]) {
    for (const delta of deltas) {
        delta.addPositionDelta(delta.initialVelocity);
    }
}

function computeGravitationalForce(gravitationalConstant: number,
                                   particle: Particle,
                                   other: Particle): ReadonlyVector {
    const position = particle.positionTimeSeries.last;
    const otherPosition = other.positionTimeSeries.last;
    const xDistance = otherPosition.x - position.x;
    const yDistance = otherPosition.y - position.y;
    const distanceSquared = xDistance ** 2 + yDistance ** 2;
    const forceMagnitude = gravitationalConstant * particle.mass * other.mass / distanceSquared;
    const distance = distanceSquared ** .5;
    return {
        x: forceMagnitude * xDistance / distance,
        y: forceMagnitude * yDistance / distance
    };
}

function simulateGravity(gravitationalConstant: number, deltas: ParticleDelta[]) {
    for (const delta of deltas) {
        const totalGravitationalForce = { x: 0, y: 0 };
        for (const other of deltas) {
            if (other !== delta) {
                const gravitationalForce = computeGravitationalForce(gravitationalConstant,
                                                                     delta.particle,
                                                                     other.particle);
                totalGravitationalForce.x += gravitationalForce.x;
                totalGravitationalForce.y += gravitationalForce.y;
            }
        }
        const acceleration = {
            x: totalGravitationalForce.x / delta.particle.mass,
            y: totalGravitationalForce.y / delta.particle.mass
        };
        delta.addPositionDelta({ x: acceleration.x / 2, y: acceleration.y / 2 });
        delta.addVelocityDelta(acceleration);
    }
}

export default class Simulation {
    gravitySimulator = GravitySimulator.INTEGRATE;
    gravitationalConstant = 1;
    private clock = { time: 0 };
    private particles: Particle[] = [];

    // precondition - particle state time series do no surpass current time
    step(): void {
        this.clock.time++;
        const deltas = this.particles.map(particle => new ParticleDelta(particle));
        simulateConstantVelocity(deltas);
        if (this.gravitySimulator === GravitySimulator.INTEGRATE) {
            simulateGravity(this.gravitationalConstant, deltas);
        }
        for (const delta of deltas) {
            delta.apply(this.clock.time);
        }
    }

    stepBack(): void {
        this.clock.time--;
        for (const particle of this.particles) {
            particle.clearAfter(this.clock.time);
        }
    }

    createParticle(cx: number, cy: number, r: number): ParticleSnapshot | undefined {
        if (r === 0) {
            return;
        }
        const toAdd = new Particle(this.clock.time, { x: cx, y: cy }, r);
        for (const particle of this.particles) {
            if (particle.overlaps(this.clock.time, toAdd)) {
                return;
            }
        }
        this.particles.push(toAdd);
        return new ParticleSnapshotImpl(this.clock, toAdd);
    }

    addParticle(particleSnapshot: ParticleSnapshot): void;
    addParticle({ particle }: ParticleSnapshotImpl): void {
        this.particles.push(particle);
    }

    removeParticle(particleSnapshot: ParticleSnapshot): void;
    removeParticle({ particle }: ParticleSnapshotImpl): void {
        const i = this.particles.indexOf(particle);
        if (i !== -1) {
            this.particles.splice(i, 1);
        }
    }

    private isValidUpdate(particle: Particle,
                          { x = particle.positionTimeSeries.firstNotAfter(this.clock.time).x,
                            y = particle.positionTimeSeries.firstNotAfter(this.clock.time).y,
                            radius = particle.radius }) {
        for (const other of this.particles) {
            if (other === particle) {
                continue;
            }
            if (distanceBetween({ x, y }, other.getPosition(this.clock.time)) <= radius + other.radius) {
                return false;
            }
        }
        return true;
    }

    isValidPositionX(particleSnapshot: ParticleSnapshot, x: number): boolean;
    isValidPositionX({ particle }: ParticleSnapshotImpl, x: number): boolean {
        return this.isValidUpdate(particle, { x });
    }

    setPositionX(particleSnapshot: ParticleSnapshot, x: number): void;
    setPositionX({ particle }: ParticleSnapshotImpl, x: number): void {
        const val = {
            x,
            y: particle.positionTimeSeries.last.y
        };
        particle.positionTimeSeries
                .addLast({ time: this.clock.time, val });
    }

    isValidPositionY(particleSnapshot: ParticleSnapshot, y: number): boolean;
    isValidPositionY({ particle }: ParticleSnapshotImpl, y: number): boolean {
        return this.isValidUpdate(particle, { y });
    }

    setPositionY(particleSnapshot: ParticleSnapshot, y: number): void;
    setPositionY({ particle }: ParticleSnapshotImpl, y: number): void {
        const val = {
            x: particle.positionTimeSeries.last.x,
            y
        };
        particle.positionTimeSeries
                .addLast({ time: this.clock.time, val });
    }

    setVelocityX(particleSnapshot: ParticleSnapshot, velocityX: number): void;
    setVelocityX({ particle }: ParticleSnapshotImpl, velocityX: number): void {
        const val = {
            x: velocityX,
            y: particle.velocityTimeSeries.last.y
        };
        particle.velocityTimeSeries
                .addLast({ time: this.clock.time, val });
    }

    setVelocityY(particleSnapshot: ParticleSnapshot, velocityY: number): void;
    setVelocityY({ particle }: ParticleSnapshotImpl, velocityY: number): void {
        const val = {
            x: particle.velocityTimeSeries.last.x,
            y: velocityY,
        };
        particle.velocityTimeSeries
                .addLast({ time: this.clock.time, val });
    }

    isValidRadius(particleSnapshot: ParticleSnapshot, radius: number): boolean;
    isValidRadius({ particle }: ParticleSnapshotImpl, radius: number): boolean {
        return this.isValidUpdate(particle, { radius });
    }

    setRadius(particleSnapshot: ParticleSnapshot, radius: number): void;
    setRadius({ particle }: ParticleSnapshotImpl, radius: number): void {
        particle.radius = radius;
    }

    setMass(particleSnapshot: ParticleSnapshot, mass: number): void;
    setMass({ particle }: ParticleSnapshotImpl, mass: number): void {
        particle.mass = mass;
    }
}
