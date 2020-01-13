import Bounds from '../../geometry/bounds';
import Coordinates from "../coordinates";
import Point from '../../geometry/point';

interface projectionInterface {
	bounds: Bounds;
	project(coordinates: Coordinates): Point;
	unproject(point: Point): Coordinates;
}

export default projectionInterface;