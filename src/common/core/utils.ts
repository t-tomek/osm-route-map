export function wrapNum(x: number, [min, max]: number[], includeMax = false) {
    const difference = max - min;

    return (x === max && includeMax) ?
        x :
        ((x - min) % difference + difference) % difference + min
    ;
}
