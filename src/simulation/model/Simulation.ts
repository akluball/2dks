import Particle from './Particle';
import { distanceBetween } from './Vector';
import ParticleSnapshot from './ParticleSnapshot';

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
        return this.particle.velocity.x;
    }

    get velocityY(): number {
        return this.particle.velocity.y;
    }
}

export default class Simulation {
    private clock = { time: 0 };
    private particles: Particle[] = [];

    step(): void {
        this.clock.time++;
        for (const particle of this.particles) {
            const steppedPosition = {
                x: particle.positionTimeSeries.firstNotAfter(this.clock.time).x + particle.velocity.x,
                y: particle.positionTimeSeries.firstNotAfter(this.clock.time).y + particle.velocity.y
            };
            particle.positionTimeSeries.addLast({ time: this.clock.time, val: steppedPosition });
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
        particle.positionTimeSeries
                .addLast({ time: this.clock.time, val: { x, y: particle.positionTimeSeries.last.y } });
    }

    isValidPositionY(particleSnapshot: ParticleSnapshot, y: number): boolean;
    isValidPositionY({ particle }: ParticleSnapshotImpl, y: number): boolean {
        return this.isValidUpdate(particle, { y });
    }

    setPositionY(particleSnapshot: ParticleSnapshot, y: number): void;
    setPositionY({ particle }: ParticleSnapshotImpl, y: number): void {
        particle.positionTimeSeries
                .addLast({ time: this.clock.time, val: { x: particle.positionTimeSeries.last.x, y } });
    }

    isValidRadius(particleSnapshot: ParticleSnapshot, radius: number): boolean;
    isValidRadius({ particle }: ParticleSnapshotImpl, radius: number): boolean {
        return this.isValidUpdate(particle, { radius });
    }

    setRadius(particleSnapshot: ParticleSnapshot, radius: number): void;
    setRadius({ particle }: ParticleSnapshotImpl, radius: number): void {
        particle.radius = radius;
    }

    setVelocityX(particleSnapshot: ParticleSnapshot, velocityX: number): void;
    setVelocityX({ particle }: ParticleSnapshotImpl, velocityX: number): void {
        particle.velocity = { x: velocityX, y: particle.velocity.y };
    }

    setVelocityY(particleSnapshot: ParticleSnapshot, velocityY: number): void;
    setVelocityY({ particle }: ParticleSnapshotImpl, velocityY: number): void {
        particle.velocity = { x: particle.velocity.x, y: velocityY };
    }
}
