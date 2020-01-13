import CrsEarth from "./crs.earth";
import Transformation from "../../geometry/transformation";
import {
	EARTH_RADIUS,
	default as SphericalMercator
} from "../projection/sphericalMercator";

class CrsEpsg385 extends CrsEarth {
	public code = 'EPSG:3857';
	public projection = SphericalMercator;
	public transformation = (() => {
		const scale = 0.5 / (Math.PI * EARTH_RADIUS);
		
		return new Transformation(scale, 0.5, -scale, 0.5);
	})();
}

export default CrsEpsg385;