class Coordinates {
	constructor(
		protected latitude: number,
		protected longitude: number,
		protected alt?: number
	) {
		//	
	};

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
}

export default Coordinates;
