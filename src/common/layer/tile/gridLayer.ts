import Bounds from "../../geometry/bounds";
import Coordinates from "../../geo/coordinates";
import Point from "../../geometry/point";
import Map from "../../map";

export type gridLayerOptions = {
    keepBuffer: number,
    maxNativeZoom: number,
    maxZoom: number,
    minNativeZoom: number,
    minZoom: number,
    tileSize: number,
    zIndex: number,
};

class GridLayer {
    protected options: gridLayerOptions = {
        keepBuffer: 2,
        maxNativeZoom: Number.POSITIVE_INFINITY,
        maxZoom: Number.POSITIVE_INFINITY,
        minNativeZoom: Number.NEGATIVE_INFINITY,
        minZoom: Number.NEGATIVE_INFINITY,
        tileSize: 256,
        zIndex: 1,
    };
    protected isLoading = false;

    constructor(protected map: Map, options: Partial<gridLayerOptions> = {}) {
        this.options = Object.assign({}, this.options,  options);
    };

    public getIsLoading() {
        return this.isLoading;
    }

    public getTileSize() {
        const tileSize = this.options.tileSize;

        return (typeof tileSize === 'number') ?
            new Point(tileSize, tileSize) :
            tileSize
        ;
    };


    public setZIndex(zIndex: number) {
        this.options.zIndex = zIndex;
        this.updateZIndex();

        return this;
    };

    protected clampZoom(zoom: number) {
        if (zoom < this.options.minNativeZoom) {
            return this.options.minNativeZoom;
        }
        if (zoom > this.options.maxNativeZoom) {
            return this.options.maxNativeZoom;
        }

        return zoom;
    };

    protected getTiledPixelBounds(center: Coordinates) {
        const mapZoom = this.map.getZoom();
        const scale = this.map.getZoomScale(mapZoom, mapZoom);
        const pixelCenter = this.map.project(center, mapZoom).floor();
        const halfSize = this.map.getSize().divideBy(scale * 2);

        return new Bounds([
            pixelCenter.subtract(halfSize),
            pixelCenter.add(halfSize)
        ]);
    };

    protected pxBoundsToTileRange(bounds: Bounds) {
        const tileSize = this.getTileSize();

        return new Bounds([
            bounds
                .getMin()
                .unscaleBy(tileSize)
                .floor(),
            bounds
                .getMax()
                .unscaleBy(tileSize)
                .ceil()
                .subtract(
                    new Point(1, 1)
                )
        ]);
    };

    protected setView(center: Coordinates, zoom: number) {
        const tileZoom = this.clampZoom(Math.round(zoom));
    };

    protected resetView() {
        this.setView(this.map.getCenter(), this.map.getZoom());
    };

    protected updateZIndex() {
        //
    }






    public draw2(center: Coordinates, zoom: number) {
        const pixelBounds = this.getTiledPixelBounds(center);
        const tileRange = this.pxBoundsToTileRange(pixelBounds);
        const tileCenter = tileRange.getCenter();

        const tileRangeMin = tileRange.getMin();
        const tileRangeMax = tileRange.getMax();

        const halfSize = this.map.getSize().divideBy(2);
        const unscaledPoint = this.map.project(center, zoom).unscaleBy(this.getTileSize());
        const offset = tileRangeMin
            .subtract(unscaledPoint)
            .abs()
            .scaleBy(this.getTileSize())
            .subtract(halfSize)
            .trunc();
        ;

        let i = 0;
        let j = 0;
        const tiles: any = [];

        for(let y of this.range(tileRangeMin.getY(), tileRangeMax.getY())) {
            j = 0;

            for(let x of this.range(tileRangeMin.getX(), tileRangeMax.getX())) {
                tiles.push({
                    url: `http://fmmap.framelogic.pl/tile-server/${zoom}/${x}/${y}.png`,
                    offset: this.getTileSize().multiply(new Point(j, i)),
                });
                ++j;
            }
            // console.log(i)
            ++i;
        }

        return {
            tiles,
            imageSize: this.getTileSize().multiply(new Point(j, i)),
            offset,
        };
    };

    public draw(center: Coordinates, zoom: number, points: Coordinates[]) {

        const pixelBounds = this.getTiledPixelBounds(center);
        const tileRange = this.pxBoundsToTileRange(pixelBounds);
        const tileCenter = tileRange.getCenter();

        const tileRangeMin = tileRange.getMin();
        const tileRangeMax = tileRange.getMax();

        const halfSize = this.map.getSize().divideBy(2);
        const unscaledPoint = this.map.project(center, zoom).unscaleBy(this.getTileSize());
        const offset = tileRangeMin
            .subtract(unscaledPoint)
            .abs()
            .scaleBy(this.getTileSize())
            .subtract(halfSize)
            .trunc()
        ;

        const mapSize = this.map.getSize();


        let tiles: string = `<div style="position: relative"><div style="position: absolute;width: ${mapSize.getX()}px;height: ${mapSize.getY()}px;border: black 1px solid;top: ${offset.getY()}px;left: ${offset.getX()}px;"></div>`;

        let i = 0;
        points.forEach((point) => {
            // const pointOffset;
            const unscaledPoi = this.map.project(point, zoom).unscaleBy(this.getTileSize());
            const offset = tileRangeMin
                .subtract(unscaledPoi)
                .abs()
                .scaleBy(this.getTileSize())
                .trunc()
            ;

            tiles += `<div style="position: absolute;top: calc(${offset.getY()}px - 10px);left: calc(${offset.getX()}px - 10px);color: cornsilk;width: 20px;height: 20px;display: flex;justify-content: center;background:rgba(127,0,0,0.5); border: solid; border-radius: 20px;">${++i}</div>`
        });

        for(let y of this.range(tileRangeMin.getY(), tileRangeMax.getY())) {
            tiles += '<div>';

            for(let x of this.range(tileRangeMin.getX(), tileRangeMax.getX())) {
                let coords = new Point(x, y);

                tiles += `<img src="http://fmmap.framelogic.pl/tile-server/${zoom}/${x}/${y}.png"/>`;
            }

            tiles += '</div>';
        }

        tiles += "</div>";

        // tiles.sort(function (a: Point, b: Point) {
        //     return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
        // });


        return {
            pixelBounds,
            tileRange,
            tileCenter,
            tiles,
        }
    };


    protected *range(start: number = 0, end: number,  step: number = 1) {
        let  iterationCount = 0;
        for (let i = start; i <= end; i += step) {
            iterationCount++;
            yield i;
        }

        return iterationCount;
    };
}

export default GridLayer;
