class Point {
    constructor(public x:number, public y:number) {};

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
}

export default Point;
