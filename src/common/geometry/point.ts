class Point {
    public x: number;
    public y: number;
    public round: number|null;

    constructor(coordinates: number[]);
    constructor(x: number, y: number, round?: number);
    constructor(x: number|number[], y?: number, round?: number) {
        if (x instanceof Array) {
            [this.x, this.y, this.round = null] = x;
        } else if(y !== undefined) {
            [this.x, this.y, this.round = null] = [x, y, round];
        }
    }

    public getX() {
        return this.x;
    }

    public getXRad() {
        return this.x;
    }

    public getXDeg() {
        return this.x * 180 / Math.PI;
    }

    public getY() {
        return this.y;
    }

    public getYRad() {
        return this.y;
    }

    public getYDeg() {
        return this.y * 180 / Math.PI;
    }

    public setX(x: number) {
        this.x = x;

        return this;
    }

    public setY(y: number) {
        this.y = y;

        return this;
    }

    public add(point: Point) {
    	return new Point(
    		this.getX() + point.getX(),
    		this.getY() + point.getY()
		);
    }

    public subtract(point: Point) {
    	return new Point(
    		this.getX() - point.getX(),
    		this.getY() - point.getY()
		);
    }

    public divideBy(factor: number) {
        return new Point(
            this.getX() / factor,
            this.getY() / factor
        );
    }
}

export default Point;
