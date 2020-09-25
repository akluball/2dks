import TimeSeries from './TimeSeries';
import { ReadonlyVector, distanceBetween } from './vector';

export default class Particle {
    positionTimeSeries: TimeSeries<ReadonlyVector>;
    velocityTimeSeries: TimeSeries<ReadonlyVector>;
    radius: number;
    mass: number;

    constructor(time: number, center: ReadonlyVector, radius: number) {
        this.positionTimeSeries = new TimeSeries(time, center);
        this.velocityTimeSeries = new TimeSeries(time, { x: 0, y: 0 });
        this.radius = radius;
        this.mass = 4 * Math.PI * (this.radius ** 3) / 3000;
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
        this.velocityTimeSeries.clearAfter(time);
    }
}
