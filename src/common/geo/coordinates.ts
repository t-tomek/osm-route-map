class Coordinates {

	constructor(
		protected latitude: number,
		protected longitude: number,
		protected altitude: number | null = null
	) {
		//	
	};

	public getAlt() {
		return this.altitude;
	}

	public getLatitude() {
		return this.latitude;
	}

	public getLatitudeDeg() {
		return this.latitude;
	}

	public getLatitudeRad() {
		return this.latitude * Math.PI / 180;
	}

	public getLongitude() {
		return this.longitude;
	}

	public getLongitudeDeg() {
		return this.longitude;
	}

	public getLongitudeRad() {
		return this.longitude * Math.PI / 180;
	}

	public setLatitude(latitude:number) {
		this.latitude = latitude;

		return this;
	}

	public setLongitude(longitude:number) {
		this.longitude = longitude;
		
		return this;
	}
}

export default Coordinates;