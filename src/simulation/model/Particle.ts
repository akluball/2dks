import Vector, { distanceBetween } from './Vector';

export default class Particle {
    position: Vector;
    radius: number;

    constructor(center: Vector, radius: number) {
        this.position = center;
        this.radius = radius;
    }

    overlaps(other: Particle): boolean {
        return this.radius + other.radius >= distanceBetween(this.position, other.position);
    }
}
