import {
    Request,
    Response,
} from "express";

import Point from "../common/geometry/point";
import Coordinates from "../common/geo/coordinates";
import CoordinatesBounds from "../common/geo/coordinatesBounds";
import Map from "../common/map";


export const generate = (request: Request, response: Response) => {
    const map = new Map({
        width: 1000,
        height: 400,
        // center: new Coordinates(52, 19),
        // zoom: 4,
        maxZoom: 19,
        minZoom: 1,
    });


    const bounds = new CoordinatesBounds([
        new Coordinates(51.10193, 17.03683),
        new Coordinates(51.10378, 17.02399),
        new Coordinates(51.10333, 17.01929),
        new Coordinates(51.09540, 17.01656),
        new Coordinates(50.89423, 14.89951),

    ]);


    response.json({
        map,
        zoom: map.getBoundsCenterZoom(bounds),
    });
    
//     const coordinates = request.query.coordinates
//         .split(';')
//         .map((x) => x.split(','));
//     console.log(coordinates);
}; 

