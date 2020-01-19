import Bounds from "./geometry/bounds";
import Coordinates from "./geo/coordinates";
import CoordinatesBounds from "./geo/coordinatesBounds";
import Crs from "./geo/crs/crs";
import EPSG3857 from "./geo/crs/crsEpsg3857";
import Point from "./geometry/point";

type mapOptions = {
    center: Coordinates,
    crs: Crs,
    height: number,
    maxZoom: number,
    minZoom: number,
    position: Point,
    width: number,
    zoom: number,
    zoomSnap: number,
};

class Map {
    private options: mapOptions = {
        center:  new Coordinates(0, 0),
        crs: new EPSG3857(),
        height: 400,
        maxZoom: Number.POSITIVE_INFINITY,
        minZoom: 1,
        position: new Point(0, 0),
        width: 400,
        zoom: 1,
        zoomSnap: 1,
    };

    constructor(options: Partial<mapOptions>) {
        this.options = Object.assign({}, this.options,  options);
    };

    public getBoundsZoom(
        coordinatesBounds: CoordinatesBounds,
        inside: Boolean = false,
        padding = new Point(0, 0)
    ) {
        const zoom = this.getZoom()
        const bounds = new Bounds([
            this.project(coordinatesBounds.getSouthEast(), zoom),
            this.project(coordinatesBounds.getNorthWest(), zoom)
        ]);
        const boundsSize = bounds.getSize();

        const size = this.getSize().subtract(padding);
        const scaleX = size.getX() / boundsSize.getX();
        const scaleY = size.getY() / boundsSize.getY();
        const scale = (inside) ?
            Math.max(scaleX, scaleY) :
            Math.min(scaleX, scaleY)
        ;

        let boundsZoom = this.getScaleZoom(scale, zoom);
        const snap = this.getSnap();
        if (snap) {
            boundsZoom = Math.round(boundsZoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
            boundsZoom = (inside) ?
                Math.ceil(boundsZoom / snap) * snap :
                Math.floor(boundsZoom / snap) * snap
            ;
        }

        return Math.max(
            this.getMinZoom(),
            Math.min(this.getMaxZoom(), boundsZoom)
        );
    };

    public getCenter() {
        return this.layerPointToCoordinates(this.getCenterLayerPoint());
    };

    public getCenterLayerPoint() {
        return this.containerPointToLayerPoint(this.getSize().divideBy(2));
    };

    public containerPointToLayerPoint(point: Point) {
        return point.subtract(this.getMapPanePos());
    };

    public getMinZoom() {
        return this.options.minZoom;
    };

    public getMaxZoom() {
        return this.options.maxZoom;
    };

    public getScaleZoom(scale: number, fromZoom: number = this.getZoom()) {
        const zoom = this.options
            .crs
            .zoom(scale * this.options.crs.scale(fromZoom));

        return isNaN(zoom) ? Infinity : zoom;
    };

    public getSize() {
        return new Point(this.options.width, this.options.height);
    };

    public getSnap() {
        return this.options.zoomSnap;
    };

    public getZoom() {
        return this.options.zoom;
    };

    public getZoomScale(toZoom: number, fromZoom: number = this.getZoom()) {
        return this.options.crs.scale(toZoom) / this.options.crs.scale(fromZoom);
    };

    // is it useful?
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

    public layerPointToCoordinates(point: Point) {
        return this.unproject(
            point.add(this.getPixelOrigin())
        );
    };

    public project(coordinates: Coordinates, zoom: number = this.getZoom()) {
        return this.options.crs.coordinatesToPoint(coordinates, zoom);
    };

    public unproject(point: Point, zoom: number = this.getZoom()) {
        return this.options.crs.pointToCoordinates(point, zoom);
    };

    protected getBoundsCenterZoom(
        cordinatesBounds: CoordinatesBounds,
        options: any = {
            padding: {},
            paddingTopLeft: {},
            paddingBottomRight: {},
            maxZoom: Number.POSITIVE_INFINITY,
        }
    ) {
        const paddingTL = new Point(
            options.paddingTopLeft.x || options.padding.x || 0,
            options.paddingTopLeft.y || options.padding.y || 0
        );
        const paddingBR = new Point(
            options.paddingBottomRight.x || options.padding.y || 0,
            options.paddingBottomRight.y || options.padding.y || 0
        );
        const zoom = Math.min(
            options.maxZoom,
            this.getBoundsZoom(
                cordinatesBounds,
                false,
                paddingTL.add(paddingBR)
            )
        );

        if (zoom === Number.POSITIVE_INFINITY) {
            return {
                center: cordinatesBounds.getCenter(),
                zoom,
            };
        }

        const paddingOffset = paddingBR.subtract(paddingTL).divideBy(2);

        const southWestPoint = this.project(
            cordinatesBounds.getSouthWest(),
            zoom
        );
        const northEastPoint = this.project(
            cordinatesBounds.getNorthEast(),
            zoom
        );
        const center = this.unproject(
            southWestPoint
                .add(northEastPoint)
                .divideBy(2)
                .add(paddingOffset),
            zoom
        );

        return {
            center,
            zoom,
        };
    };

    protected getMapPanePos() {
        return new Point(0, 0);
    };

    protected limitZoom(zoom: number) {
        const snap = this.getSnap();

        const snapZoom = (snap) ?
            Math.round(zoom / snap) * snap :
            zoom;

        return Math.max(
            this.getMinZoom(),
            Math.min(this.getMaxZoom(), snapZoom)
        );
    };
}

export default Map;
