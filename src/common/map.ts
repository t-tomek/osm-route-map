import Point from "./geometry/point";
import Bounds from "./geometry/bounds";
import Coordinates from "./geo/coordinates";
import CoordinatesBounds from "./geo/coordinatesBounds";
import EPSG3857 from "./geo/crs/crs.epsg3857";

type Partial<T> = {
    [P in keyof T]?: T[P];
}

type requiredOptions = {
    height: number,
    width: number,
};

type optionalOptions = {
    crs: any,
    center: Coordinates | null,
    position: Point,
    zoom: number,
    maxZoom: number,
    minZoom: number,
    zoomSnap: number,
};

type mapOptions = requiredOptions & optionalOptions;
type mapOptionsParameters = requiredOptions & Partial<optionalOptions>;

class Map {
    private options: mapOptions = {
        width: 400,
        height: 400,

        crs: new EPSG3857(),
        center:  null,
        zoom: 1,
        maxZoom: 19,
        minZoom: 1,
        zoomSnap: 1,
        position: new Point(0, 0),
    };

    constructor(options: mapOptionsParameters) {
        this.options = Object.assign({}, this.options,  options);
    };


    public getSize() {
        return new Point(this.options.width, this.options.height);
    };

    public getZoom() {
        return this.options.zoom;
    };

    public getZoomScale(toZoom: number, fromZoom: number = this.getZoom()) {
        return this.options.crs.scale(toZoom) / this.options.crs.scale(fromZoom);
    };

    public getMinZoom() {
        return this.options.minZoom;
    };

    public getMaxZoom() {
        return this.options.maxZoom;
    };

    public getBoundsZoom(coordinatesBounds: CoordinatesBounds, inside: Boolean = false, padding: Point = new Point(0, 0)) { // (LatLngBounds[, Boolean, Point]) -> Number
        const size = this.getSize().subtract(padding);
        const bounds = new Bounds([
            this.project(coordinatesBounds.getSouthEast(), this.getZoom()),
            this.project(coordinatesBounds.getNorthWest(), this.getZoom())
        ]);
        const boundsSize = bounds.getSize();

        const scaleX = size.getX() / boundsSize.getX();
        const scaleY = size.getY() / boundsSize.getY();
        const scale = (inside) ?
            Math.max(scaleX, scaleY) :
            Math.min(scaleX, scaleY)
        ;

        let zoom = this.getScaleZoom(scale, this.getZoom());
        const snap = this.options.zoomSnap;
        if (snap) {
            zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
            zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
        }

        return Math.max(this.getMinZoom(), Math.min(this.getMaxZoom(), zoom));
    };

    public getScaleZoom(scale: number, fromZoom: number = this.getZoom()) {
        const zoom = this.options.crs.zoom(scale * this.options.crs.scale(fromZoom));

        return isNaN(zoom) ? Infinity : zoom;
    };

    public getPixelOrigin() {
        return new Point(0, 0);
    };

    public setZoom(zoom: number) {
        this.options.zoom = zoom;
    };

    public coordinatesToLayerPoint(coordinates: Coordinates) {
        const projectedPoint = this.project(coordinates).round();
        
        return projectedPoint.subtract(this.getPixelOrigin());
    };

    public project(coordinates: Coordinates, zoom: number = this.getZoom()) {
        return this.options.crs.coordinatesToPoint(coordinates, zoom);
    };

    public unproject(point: Point, zoom: number = this.getZoom()) {
        return this.options.crs.pointToCoordinates(point, zoom);
    };

    private limitZoom(zoom: number) {
        const snap = this.options.zoomSnap;

        const limitedZoom = (snap) ?
            Math.round(zoom / snap) * snap :
            zoom;

        return Math.max(this.getMinZoom(), Math.min(this.getMaxZoom(), limitedZoom));
    };

    public getBoundsCenterZoom(cordinatesBounds: CoordinatesBounds, options: any = {}) {
        const paddingTL = new Point(options.paddingTopLeft || options.padding || [0, 0]);
        const paddingBR = new Point(options.paddingBottomRight || options.padding || [0, 0]);

        let zoom = this.getBoundsZoom(cordinatesBounds, false, paddingTL.add(paddingBR));
        zoom = (typeof options.maxZoom === 'number') ? Math.min(options.maxZoom, zoom) : zoom;

        if (zoom === Infinity) {
            return {
                center: cordinatesBounds.getCenter(),
                zoom: zoom
            };
        }

        const paddingOffset = paddingBR.subtract(paddingTL).divideBy(2);

        const swPoint = this.project(cordinatesBounds.getSouthWest(), zoom);
        const nePoint = this.project(cordinatesBounds.getNorthEast(), zoom);
        const center = this.unproject(
            swPoint.add(nePoint)
                .divideBy(2)
                .add(paddingOffset),
            zoom
        );

        return {
            center,
            zoom,
        };
    };

}

export default Map;