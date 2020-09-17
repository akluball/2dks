import TimeSeries from './TimeSeries';
import { ReadonlyVector, distanceBetween } from './vector';

export default class Particle {
    positionTimeSeries: TimeSeries<ReadonlyVector>;
    radius: number;
    velocity: ReadonlyVector;

    constructor(time: number, center: ReadonlyVector, radius: number) {
        this.positionTimeSeries = new TimeSeries(time, center);
        this.radius = radius;
        this.velocity = { x: 0, y: 0 };
    }

    getPosition(time: number): ReadonlyVector {
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
