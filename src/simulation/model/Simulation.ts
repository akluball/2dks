import CollisionSimulator from './CollisionSimulator';
import GravitySimulator from './GravitySimulator';
import Particle from './Particle';
import ParticleSnapshot from './ParticleSnapshot';
import PriorityQueue from './PriorityQueue';
import TimeSeries from './TimeSeries';
import { distanceBetween, ReadonlyVector } from './geometry';

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

    get velocityX(): number {
        return this.particle.velocityTimeSeries
                            .firstNotAfter(this.clock.time).x;
    }

    get velocityY(): number {
        return this.particle.velocityTimeSeries
                            .firstNotAfter(this.clock.time).y;
    }

    get radius(): number {
        return this.particle.radius;
    }

    get mass(): number {
        return this.particle.mass;
    }
}

function findQuadraticRoots(a: number, b: number, c: number): [number, number] {
    const term = ((b ** 2) - 4 * a * c) ** .5;
    if (term < 0) {
        return [ NaN, NaN ];
    }
    return [ (-b + term) / (2 * a), (-b - term) / (2 * a) ];
}

// invariant - last position and velocity should have the same timestamp time
class ParticleStep {
    private acceleration: ReadonlyVector;
    private positions: TimeSeries<ReadonlyVector>;
    private velocities: TimeSeries<ReadonlyVector>;

    constructor(private particle: Particle) {
        this.acceleration = { x: 0, y: 0 };
        this.positions = new TimeSeries(0, particle.positionTimeSeries.last);
        this.velocities = new TimeSeries(0, particle.velocityTimeSeries.last);
    }

    get mass(): number {
        return this.particle.mass;
    }

    positionAt(time: number): ReadonlyVector {
        const { time: positionTime, val: position } = this.positions.firstNotAfterTimestamped(time);
        const velocity = this.velocityAt(time);
        const timeDelta = time - positionTime;
        // assumes velocity is constant over time period (implied by invariant)
        return {
            x: position.x + velocity.x * timeDelta,
            y: position.y + velocity.y * timeDelta,
        };
    }

    velocityAt(time: number): ReadonlyVector {
        return this.velocities.firstNotAfter(time);
    }

    setKinematics(time: number, position: ReadonlyVector, velocity: ReadonlyVector) {
        this.positions.addLast({ time, val: position });
        this.velocities.addLast({ time, val: velocity });
    }

    simulateConstantForce(force: ReadonlyVector): void {
        this.acceleration = {
            x: force.x / this.particle.mass,
            y: force.y / this.particle.mass
        };
        const velocity = {
            x: this.velocities.last.x + this.acceleration.x / 2,
            y: this.velocities.last.y + this.acceleration.y / 2
        };
        this.velocities.addLast({ time: this.velocities.lastTime, val: velocity });
    }

    detectCollisionTimes(other: ParticleStep): number[] {
        const startTime = Math.max(this.positions.lastTime, other.positions.lastTime);
        const endTime = 1;
        const start = this.positionAt(startTime);
        const end = this.positionAt(endTime);
        const otherStart = other.positionAt(startTime);
        const otherEnd = other.positionAt(endTime);
        const deltaXSum = otherEnd.x - otherStart.x - end.x + start.x;
        const deltaYSum = otherEnd.y - otherStart.y - end.y + start.y;
        const radiusSum = this.particle.radius + other.particle.radius;
        // particle positions are parameterized from start position (time 0) to end position (time 1)
        // the quadratic below results from comparing the distance between particle positions to the radius sum
        const roots = findQuadraticRoots(deltaXSum ** 2 + deltaYSum ** 2,
                                         2 * ((otherStart.x - start.x) * deltaXSum + (otherStart.y - start.y) * deltaYSum),
                                         (otherStart.x - start.x) ** 2 + (otherStart.y - start.y) ** 2 - radiusSum ** 2);
        const collisionTimes: number[] = [];
        // if the collision is at time 0, verify particles are moving in the same direction
        if ((roots[0] === 0 && roots[1] > 0) || (roots[0] > 0 && roots[0] <= 1)) {
            collisionTimes.push(startTime + (endTime - startTime) * roots[0]);
        }
        if ((roots[1] === 0 && roots[0] > 0) || (roots[1] > 0 && roots[1] <= 1)) {
            collisionTimes.push(startTime + (endTime - startTime) * roots[1]);
        }
        return collisionTimes;
    }

    apply(time: number) {
        const finalVelocity = {
            x: this.velocities.last.x + this.acceleration.x / 2,
            y: this.velocities.last.y + this.acceleration.y / 2
        };
        this.particle.positionTimeSeries.addLast({ time, val: this.positionAt(1) });
        this.particle.velocityTimeSeries.addLast({ time, val: finalVelocity });
    }
}

class ParticleStepCollision {
    constructor(private collisionTime: number,
        readonly a: ParticleStep,
        readonly b: ParticleStep) {
    }

    occursBefore(other: ParticleStepCollision): boolean {
        return this.collisionTime < other.collisionTime;
    }

    invalidates(other: ParticleStepCollision) {
        return this.a === other.a || this.a === other.b || this.b === other.a || this.b === other.b;
    }

    apply() {
        const aCollisionPosition = this.a.positionAt(this.collisionTime);
        const bCollisionPosition = this.b.positionAt(this.collisionTime);
        const aPreCollisionVelocity = this.a.velocityAt(this.collisionTime);
        const bPreCollisionVelocity = this.b.velocityAt(this.collisionTime);
        let aCollisionVelocity: ReadonlyVector;
        let bCollisionVelocity: ReadonlyVector;
        const slope = (bCollisionPosition.y - aCollisionPosition.y) / (bCollisionPosition.x - aCollisionPosition.x);
        if (!isFinite(slope)) {
            aCollisionVelocity = {
                x: 0,
                y: aPreCollisionVelocity.y
            };
            bCollisionVelocity = {
                x: 0,
                y: bPreCollisionVelocity.y
            };
        } else {
            // velocity components perpendicular to the collision plane
            aCollisionVelocity = {
                x: (aPreCollisionVelocity.x + slope * aPreCollisionVelocity.y) / (1 + slope ** 2),
                y: (slope * aPreCollisionVelocity.x + (slope ** 2) * aPreCollisionVelocity.y) / (1 + slope ** 2)
            };
            bCollisionVelocity = {
                x: (bPreCollisionVelocity.x + slope * bPreCollisionVelocity.y) / (1 + slope ** 2),
                y: (slope * bPreCollisionVelocity.x + (slope ** 2) * bPreCollisionVelocity.y) / (1 + slope ** 2)
            };
        }
        const aMass = this.a.mass;
        const bMass = this.b.mass;
        const totalMass = aMass + bMass;
        // post elastic collision velocity (momentum and kinetic energy conserved)
        const aPostCollisionVelocity = {
            x: (aPreCollisionVelocity.x - aCollisionVelocity.x) + ((aMass - bMass) * aCollisionVelocity.x + 2 * bMass * bCollisionVelocity.x) / totalMass,
            y: (aPreCollisionVelocity.y - aCollisionVelocity.y) + ((aMass - bMass) * aCollisionVelocity.y + 2 * bMass * bCollisionVelocity.y) / totalMass
        };
        this.a.setKinematics(this.collisionTime, aCollisionPosition, aPostCollisionVelocity);
        const bPostCollisionVelocity = {
            x: (bPreCollisionVelocity.x - bCollisionVelocity.x) + (2 * aMass * aCollisionVelocity.x + (bMass - aMass) * bCollisionVelocity.x) / totalMass,
            y: (bPreCollisionVelocity.y - bCollisionVelocity.y) + (2 * aMass * aCollisionVelocity.y + (bMass - aMass) * bCollisionVelocity.y) / totalMass
        };
        this.b.setKinematics(this.collisionTime, bCollisionPosition, bPostCollisionVelocity);
    }
}

function computeGravitationalForce(gravitationalConstant: number,
                                   step: ParticleStep,
                                   other: ParticleStep): ReadonlyVector {
    const position = step.positionAt(0);
    const otherPosition = other.positionAt(0);
    const xDistance = otherPosition.x - position.x;
    const yDistance = otherPosition.y - position.y;
    const distanceSquared = xDistance ** 2 + yDistance ** 2;
    const forceMagnitude = gravitationalConstant * step.mass * other.mass / distanceSquared;
    const distance = distanceSquared ** .5;
    return {
        x: forceMagnitude * xDistance / distance,
        y: forceMagnitude * yDistance / distance
    };
}

function simulateGravity(gravitationalConstant: number, steps: ParticleStep[]) {
    for (const step of steps) {
        const totalGravitationalForce = { x: 0, y: 0 };
        for (const other of steps) {
            if (other !== step) {
                const gravitationalForce = computeGravitationalForce(gravitationalConstant,
                                                                     step,
                                                                     other);
                totalGravitationalForce.x += gravitationalForce.x;
                totalGravitationalForce.y += gravitationalForce.y;
            }
        }
        step.simulateConstantForce(totalGravitationalForce);
    }
}

function simulateElasticCollisions(steps: ParticleStep[]) {
    const collisions = new PriorityQueue<ParticleStepCollision>((a, b) => a.occursBefore(b));
    for (let i = 0; i < steps.length; i++) {
        for (let j = i + 1; j < steps.length; j++) {
            for (const collisionTime of steps[i].detectCollisionTimes(steps[j])) {
                collisions.add(new ParticleStepCollision(collisionTime, steps[i], steps[j]));
            }
        }
    }
    while (!collisions.isEmpty()) {
        const collision = collisions.extract();
        collision.apply();
        collisions.removeIf(collision.invalidates.bind(collision));
        const { a, b } = collision;
        for (let i = 0; i < steps.length; i++) {
            if (steps[i] !== a) {
                for (const collisionTime of a.detectCollisionTimes(steps[i])) {
                    collisions.add(new ParticleStepCollision(collisionTime, a, steps[i]));
                }
            }
            if (steps[i] !== b) {
                for (const collisionTime of b.detectCollisionTimes(steps[i])) {
                    collisions.add(new ParticleStepCollision(collisionTime, b, steps[i]));
                }
            }
        }
    }
}

export default class Simulation {
    collisionSimulator = CollisionSimulator.ELASTIC;
    gravitySimulator = GravitySimulator.INTEGRATE;
    gravitationalConstant = 1;
    private clock = { time: 0 };
    private particles: Particle[] = [];

    // precondition - particle state time series do no surpass current time
    step(): void {
        this.clock.time++;
        const steps = this.particles.map(particle => new ParticleStep(particle));
        if (this.gravitySimulator === GravitySimulator.INTEGRATE) {
            simulateGravity(this.gravitationalConstant, steps);
        }
        if (this.collisionSimulator === CollisionSimulator.ELASTIC) {
            simulateElasticCollisions(steps);
        }
        for (const step of steps) {
            step.apply(this.clock.time);
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
