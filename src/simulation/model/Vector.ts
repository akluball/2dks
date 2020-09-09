interface Vector {
    readonly x: number;
    readonly y: number;
}

export function distanceBetween(a: Vector, b: Vector): number {
    return (((a.x - b.x) ** 2) + ((a.y - b.y) ** 2)) ** .5;
}

export default Vector;
