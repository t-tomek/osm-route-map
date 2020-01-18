import Bounds from "../../geometry/bounds";
import Point from "../../geometry/point";
import Coordinates from "../../geo/coordinates";

class GridLayer {
    private options = {
        tileSize: 256,
    };

    constructor(protected map: any) {

    };

    public getTileSize() {
        const tileSize = this.options.tileSize;

        return (typeof tileSize === 'number') ?
            new Point(tileSize, tileSize) :
            tileSize 
        ;
    };

    public draw2(center: Point, zoom: number) {
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
                    offset: this.getTileSize().multiply(new Point(i, j)),
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

    public draw(center: Point, zoom: number, points: Coordinates[]) {

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
            console.log(offset)

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

    private getTiledPixelBounds(center: Point) {
        const mapZoom = this.map.getZoom();
        const scale = this.map.getZoomScale(mapZoom, mapZoom);
        const pixelCenter = this.map.project(center, mapZoom).floor();
        const halfSize = this.map.getSize().divideBy(scale * 2);

        return new Bounds([
            pixelCenter.subtract(halfSize),
            pixelCenter.add(halfSize)
        ]);
    };

    private pxBoundsToTileRange(bounds: Bounds) {
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
                .subtract(new Point([1, 1]))
        ]);
    };

    private *range(start: number = 0, end: number,  step: number = 1) {
        let  iterationCount = 0;
        for (let i = start; i <= end; i += step) {
            iterationCount++;
            yield i;
        }

        return iterationCount;
    };
}

export default GridLayer;