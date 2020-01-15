import Coordinates from "../coordinates";
import Point from "../../geometry/point";
import ProjectionInterface from "../projection/projectionInterface";


abstract class Crs {
	protected abstract transformation: any;
	protected abstract projection: ProjectionInterface;
	protected infinite = false;

	public coordinatesToPoint(coordinates:Coordinates, zoom:number) {
		const scale = this.scale(zoom);
		const projectedPoint = this.projection.project(coordinates);

		return this.transformation.transform(projectedPoint, scale);
	}

	public pointToCoordinates(point:Point, zoom:number) {
		const scale = this.scale(zoom);
		const untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	}

	project(coordinates:Coordinates) {
		return this.projection.project(coordinates);
	}

	unproject(point:Point) {
		return this.projection.unproject(point);
	}

	public scale(zoom:number) {
		return 256 * Math.pow(2, zoom);
	}

	public zoom(scale:number) {
		return Math.log(scale / 256) / Math.LN2;
	}

	public getProjectedBounds(zoom:number) {
		// if (this.infinite) {
		// 	return null;
		// }

		// const bounds = this.projection.bounds;
		// const scale = this.scale(zoom);

		// const min = this.transformation.transform(bounds.min, scale);
		// const max = this.transformation.transform(bounds.max, scale);

		// return new Bounds(min, max);
	}

	wrapLatLng(coordinates:Coordinates) {
		//
	}

	wrapLatLngBounds() {
		//
	}
}

export default Crs;