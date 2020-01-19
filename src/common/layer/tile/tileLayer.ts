import GridLayer from "./gridLayer";
import Point from "../../geometry/point";
import Map from "../../map";
import {
    template
} from "../../core/utils";

type tileLayerOptions = {
    crossOrigin: boolean,
    detectRetina: boolean,
    errorTileUrl: string,
    maxZoom: number,
    subdomains: string,
    tms: boolean,
    zoomOffset: number,
    zoomReverse: boolean,
    minZoom: number,
};

type tile = {
    url: string,
};

class TileLayer extends GridLayer {
    constructor(protected map: Map, private url = "", options:  Partial<tileLayerOptions> = {}) {
        super(map, options);

        this.options = Object.assign({}, this.options, {
            crossOrigin: false,
            detectRetina: false,
            errorTileUrl: '',
            maxZoom: 18,
            minZoom: 0,
            subdomains: '',
            tms: false,
            zoomOffset: 0,
            zoomReverse: false,
        }, options);
    };

    public createTile(point: Point) {
        //
    };

    public getTileUrl(point: Point) {
        const data = {
            x: point.getX(),
            y: point.getY(),
            z: 0,
        };

        return template(this.url, data);
    };
}

export default TileLayer;
