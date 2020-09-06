import Particle from './Particle';
import Vector, { distanceBetween } from './Vector';

export default class Simulation {
    private particles: Particle[] = [];

    createParticle(cx: number, cy: number, r: number): Particle | undefined {
        if (r === 0) {
            return;
        }
        const toAdd = new Particle({ x: cx, y: cy }, r);
        for (const particle of this.particles) {
            if (particle.overlaps(toAdd)) {
                return;
            }
        }
        this.particles.push(toAdd);
        return toAdd;
    }

    removeParticle(particle: Particle): void {
        const i = this.particles.indexOf(particle);
        if (i !== -1) {
            this.particles.splice(i, 1);
        }
    }

    addParticle(particle: Particle): void {
        this.particles.push(particle);
    }

    distanceToClosest(v: Vector): number {
        let distance = Infinity;
        for (const particle of this.particles) {
            const d = distanceBetween(particle.position, v) - particle.radius;
            if (d < distance) {
                distance = d;
            }
        }
        return distance;
    }

    isValidPositionX(particle: Particle, x: number): boolean {
        const position = { x, y: particle.position.y };
        for (const other of this.particles) {
            if (other === particle) {
                continue;
            }
            if (distanceBetween(position, other.position) <= particle.radius + other.radius) {
                return false;
            }
        }
        return true;
    }

    isValidPositionY(particle: Particle, y: number): boolean {
        const position = { x: particle.position.x, y };
        for (const other of this.particles) {
            if (other === particle) {
                continue;
            }
            if (distanceBetween(position, other.position) <= particle.radius + other.radius) {
                return false;
            }
        }
        return true;
    }

    isValidRadius(particle: Particle, radius: number): boolean {
        for (const other of this.particles) {
            if (other === particle) {
                continue;
            }
            if (distanceBetween(particle.position, other.position) <= radius + other.radius) {
                return false;
            }
        }
        return true;
    }
}
