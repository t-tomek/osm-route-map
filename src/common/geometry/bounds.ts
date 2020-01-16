import Point from "./point"

class Bounds {
	private min = new Point(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
	private max = new Point(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

	constructor(private points: Point[]) {
		points.forEach((point) => {
			this.min
				.setX(Math.min(this.min.x, point.x))
				.setY(Math.min(this.min.y, point.y))
			;
			this.max
				.setX(Math.max(this.max.x, point.x))
				.setY(Math.max(this.max.y, point.y))
			;
		});
	};

	public getCenter() {
		return new Point(
			(this.min.x + this.max.x) / 2,
			(this.min.y + this.max.y) / 2
		);
	};

	public getMin() {
		return new Point(
			this.min.getX(),
			this.min.getY()
		);
	};

	public getMax() {
		return new Point(
			this.max.getX(),
			this.max.getY()
		);
	};

	public getBottomLeft() {
		return new Point(this.min.x, this.max.y);
	};

	public getBottomRight() {
		return this.max;
	};

	public getTopLeft() {
		return this.min;
	};

	public getTopRight() {
		return new Point(this.max.x, this.min.y);
	};

	public getSize() {
		return this.max.subtract(this.min);
	};
}

export default Bounds;
