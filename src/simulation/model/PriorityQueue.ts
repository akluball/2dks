interface Scheduler<T> {
    (a: T, b: T): boolean;
}

class PriorityQueue<T> {
    private heap: T[] = [];

    // precondition - comparator should return 0 when equal
    constructor(readonly scheduler: Scheduler<T>) {
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    add(t: T): void {
        this.heap.push(t);
        let i = this.heap.length - 1;
        let parentIndex = this.parentIndex(i);
        while (i > 0 && this.scheduler(this.heap[i], this.heap[parentIndex])) {
            this.swap(i, parentIndex);
            i = parentIndex;
            parentIndex = this.parentIndex(i);
        }
    }

    // precondition - heap is nonempty
    extract(): T {
        const extracted = this.heap[0];
        if (this.heap.length > 1) {
            this.heap[0] = this.heap.pop() as T;
            this.bubbleDown(0);
        } else {
            this.heap.pop();
        }
        return extracted;
    }

    removeIf(predicate: { (t: T): boolean }): void {
        let i = 0;
        while (i < this.heap.length) {
            if (predicate(this.heap[i])) {
                if (this.heap.length > i + 1) {
                    this.heap[i] = this.heap.pop() as T;
                    this.bubbleDown(i);
                } else {
                    this.heap.pop();
                }
            } else {
                i++;
            }
        }
    }

    private parentIndex(i: number) {
        return Math.floor((i - 1) / 2);
    }

    private leftIndex(i: number) {
        return i * 2 + 1;
    }

    private rightIndex(i: number) {
        return i * 2 + 2;
    }

    private bubbleDown(i: number) {
        if (this.heap.length) {
            this.heap[0] = this.heap.pop() as T;
            let leftIndex = this.leftIndex(i);
            let rightIndex = this.rightIndex(i);
            while (leftIndex < this.heap.length) {
                if (rightIndex < this.heap.length) {
                    if (this.scheduler(this.heap[leftIndex], this.heap[rightIndex])) {
                        if (this.scheduler(this.heap[leftIndex], this.heap[i])) {
                            this.swap(i, leftIndex);
                            i = leftIndex;
                            leftIndex = this.leftIndex(i);
                            rightIndex = this.rightIndex(i);
                        } else {
                            break;
                        }
                    } else if (this.scheduler(this.heap[rightIndex], this.heap[i])) {
                        this.swap(i, rightIndex);
                        i = rightIndex;
                        leftIndex = this.leftIndex(i);
                        rightIndex = this.rightIndex(i);
                    } else {
                        break;
                    }
                } else if (this.scheduler(this.heap[leftIndex], this.heap[i])) {
                    this.swap(i, leftIndex);
                    i = leftIndex;
                    leftIndex = this.leftIndex(i);
                    rightIndex = this.rightIndex(i);
                } else {
                    break;
                }
            }
        }
    }

    private swap(i: number, j: number) {
        const tmp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = tmp;
    }
}

export default PriorityQueue;
