import Map from "../map";

abstract class Layer {
    public _leaflet_id: number;
    protected map: Map;

    public addTo(map: Map) {
        map.addLayer(this);

        this.map = map;

        return this;
    };

    public abstract redraw(): void;
}

export default Layer;