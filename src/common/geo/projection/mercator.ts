import Bounds from '../../geometry/bounds';
import Point from '../../geometry/point';
import Coordinates from "../coordinates";

const R = 6378137;
const R_MINOR = 6356752.314245179;

class Mercator {
	private bounds = new Bounds([
		new Point(-20037508.34279, -15496570.73972),
		new Point(20037508.34279, 18764656.23138),
	]);

	public project(coordinates:Coordinates) {
		const tmp = R_MINOR / R;
		const e = Math.sqrt(1 - tmp * tmp);
		const con = e * Math.sin(coordinates.getLatitudeRad());

		const ts = 
			Math.tan(Math.PI / 4 - coordinates.getLatitudeRad() / 2) /
			Math.pow((1 - con) / (1 + con), e / 2)
		;

		return new Point(R * coordinates.getLongitudeRad(), -R * Math.log(Math.max(ts, 1E-10)));
	}

	public unproject(point:Point) {
		const tmp = R_MINOR / R;
		const e = Math.sqrt(1 - tmp * tmp);
		const ts = Math.exp(-point.getY() / R);

		let phi = Math.PI / 2 - 2 * Math.atan(ts);
		let con = 0;

		for (let i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
			con = e * Math.sin(phi);
			con = Math.pow((1 - con) / (1 + con), e / 2);
			dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
			phi += dphi;
		}

		return new Coordinates(phi * 180 / Math.PI, point.getXDeg() / R);
	}
}

export default Mercator;