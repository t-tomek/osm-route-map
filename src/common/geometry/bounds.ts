import Point from "./point"

class Bounds {
	private min = new Point(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
	private max = new Point(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

	constructor(private points: Point[]) {
		points.forEach((point) => {
			this.min.x = Math.min(this.min.x, point.x);
			this.max.x = Math.max(this.max.x, point.x);
			this.min.y = Math.min(this.min.y, point.y);
			this.max.y = Math.max(this.max.y, point.y);
		});
	};

	public getCenter() {
		return new Point(
			(this.min.x + this.max.x) / 2,
			(this.min.y + this.max.y) / 2
		);
	};

	public getBottomLeft() {
		return new Point(this.min.x, this.max.y);
	};

	public getTopRight() {
		return new Point(this.max.x, this.min.y);
	};

	public getTopLeft() {
		return this.min;
	};

	
	public getBottomRight() {
		return this.max;
	};

	public getSize() {
		return this.max.subtract(this.min);
	};
}

export default Bounds;
