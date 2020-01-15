import Crs from "./crs";
import Coordinates from "../coordinates";


export const EARTH_RADIUS = 6371000;

abstract class CrsEarth extends Crs {
	protected wrapLongitude = [-180, 180];

	public distance(first:Coordinates, second:Coordinates) {
		const sinDLat = Math.sin((second.getLatitude() - first.getLatitude()) / 2);
		const sinDLon = Math.sin((second.getLongitude() - first.getLongitude()) / 2);

		const a = sinDLat * sinDLat + Math.cos(first.getLatitude()) * Math.cos(second.getLatitude()) * sinDLon * sinDLon;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return EARTH_RADIUS * c;
	}
}

export default CrsEarth;
