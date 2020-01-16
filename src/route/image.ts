import {
    Request,
    Response,
} from "express";

import Point from "../common/geometry/point";
import Coordinates from "../common/geo/coordinates";
import CoordinatesBounds from "../common/geo/coordinatesBounds";
import Map from "../common/map";
import GridLayer from "../common/layer/tile/gridLayer";


export const generate = (request: Request, response: Response) => {
    const map = new Map({
        width: 500,
        height: 800,
        // center: new Coordinates(52, 19),
        // zoom: 4,
        maxZoom: 19,
        minZoom: 1,
    });


    const points = [
        new Coordinates(51.1089776,17.0326689),
        new Coordinates(51.15528106689453,16.902198791503906),
    ];

    const bounds = new CoordinatesBounds(points);

    const grid = new GridLayer(map);
    const centerZoom = map.getBoundsCenterZoom(bounds);

    map.setZoom(centerZoom.zoom);

    response.send(grid.draw(centerZoom.center, centerZoom.zoom, points).tiles);
    response.end();

    // response.json({
        // centerZoom,
        // grid: grid.draw(centerZoom.center, centerZoom.zoom)
    // });
    
//     const coordinates = request.query.coordinates
//         .split(';')
//         .map((x) => x.split(','));
//     console.log(coordinates);
}; 

