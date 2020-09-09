export function nextTick(cb: () => void): void {
    setTimeout(cb, 0);
}
