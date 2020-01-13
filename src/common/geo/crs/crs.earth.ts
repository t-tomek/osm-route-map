import Crs from "./crs";
import Coordinates from "../coordinates";

export const EARTH_RADIUS = 6371000;

class CrsEarth extends Crs {
	private wrapLongitude = [-180, 180];

	public distance(first:Coordinates, second:Coordinates) {
		const sinDLat = Math.sin((second.getLatitudeEARTH_RADIUSad() - first.getLatitudeEARTH_RADIUSad()) / 2);
		const sinDLon = Math.sin((second.getLongitude() - first.getLongitude()) / 2);

		const a = sinDLat * sinDLat + Math.cos(first.getLatitudeEARTH_RADIUSad()) * Math.cos(second.getLatitudeEARTH_RADIUSad()) * sinDLon * sinDLon;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return EARTH_RADIUS * c;
	}
}

export default CrsEarth;
