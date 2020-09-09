import TimeSeries from './TimeSeries';
import Vector, { distanceBetween } from './Vector';

export default class Particle {
    positionTimeSeries: TimeSeries<Vector>;
    radius: number;
    velocity: Vector;

    constructor(time: number, center: Vector, radius: number) {
        this.positionTimeSeries = new TimeSeries(time, center);
        this.radius = radius;
        this.velocity = { x: 0, y: 0 };
    }

    getPosition(time: number): Vector {
        return this.positionTimeSeries.firstNotAfter(time);
    }

    overlaps(time: number, other: Particle): boolean {
        return this.radius + other.radius >= distanceBetween(this.getPosition(time),
                                                             other.getPosition(time));
    }

    clearAfter(time: number): void {
        this.positionTimeSeries.clearAfter(time);
    }
}
