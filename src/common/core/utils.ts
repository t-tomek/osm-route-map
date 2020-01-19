export function wrapNum(x: number, [min, max]: number[], includeMax = false) {
    const difference = max - min;

    return (x === max && includeMax) ?
        x :
        ((x - min) % difference + difference) % difference + min
    ;
};

export function template(string: string, data: any) {
    return string.replace(/\{ *([\w_-]+) *\}/g, function (string, key) {
        var value = data[key];

        if (value === undefined) {
            throw new Error('No value provided for variable ' + string);
        }

        return value;
    });
};
