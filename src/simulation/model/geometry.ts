export interface ReadonlyVector {
    readonly x: number;
    readonly y: number;
}

export interface Vector {
    x: number;
    y: number;
}

export function distanceBetween(a: ReadonlyVector, b: ReadonlyVector): number {
    return (((a.x - b.x) ** 2) + ((a.y - b.y) ** 2)) ** .5;
}
