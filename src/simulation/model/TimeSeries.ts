interface Timestamped<T> {
    time: number;
    val: T;
}

class TimeSeries<T> {
    private series: Timestamped<T>[] = [];

    constructor(time: number, val: T) {
        this.series.push({ time, val });
    }

    // precondition - nonempty
    get last(): T {
        return this.series[this.series.length - 1].val;
    }

    clearAfter(time: number): void {
        this.series.splice(this.firstNotAfterIndex(time) + 1);
    }

    // weak precondition - timestamped.time >= this.series[this.series.length - 1].time
    // postcondition - replaces last timestamp if it has the same time
    addLast(timestamped: Timestamped<T>): void {
        if (!this.series.length) {
            this.series.push(timestamped);
            return;
        }
        const advanced = timestamped.time - this.series[this.series.length - 1].time;
        if (advanced === 0) {
            this.series[this.series.length - 1] = timestamped;
        } else if (advanced > 0) {
            this.series.push(timestamped);
        } else {
            throw new Error('out of order addition to time series');
        }
    }

    private firstNotAfterIndex(time: number): number {
        // optimization - it will often be the last value so check that one first
        if (this.series[this.series.length - 1].time <= time) {
            this.series.length - 1;
        }
        let low = 0;
        let high = this.series.length - 1;
        while (low <= high) {
            const middle = low + Math.floor((high - low) / 2);
            if (this.series[middle].time <= time) {
                low = middle + 1;
            } else {
                high = middle - 1;
            }
        }
        return high;
    }

    // precondition - this.series nonempty
    // precondition - time >= this.series[0].time
    firstNotAfter(time: number): T {
        return this.series[this.firstNotAfterIndex(time)].val;
    }
}

export default TimeSeries;
