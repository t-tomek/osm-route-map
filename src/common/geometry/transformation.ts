import Point from "./point";

class Transformation {
	constructor(
		private a:number,
		private b:number,
		private c:number,
		private d:number
	) {
		//
	};

	public transform(point:Point, scale:number = 1) {
		const x = scale * (this.a * point.getX() + this.b);
		const y = scale * (this.c * point.getY() + this.d);

		return new Point(x, y);
	}

	public untransform(point:Point, scale:number = 1) {
		const x = (point.getX() / scale - this.b) / this.a;
		const y = (point.getY() / scale - this.d) / this.c;

		return new Point(x, y);
	}
}

export default Transformation;