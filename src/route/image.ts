import {
    Request,
    Response,
} from "express";

import Coordinates from "../common/geo/coordinates";
import CoordinatesBounds from "../common/geo/coordinatesBounds";

export const generate = (request: Request, response: Response) => {
    console.log('generating...');

    const coordinatesBounds = new CoordinatesBounds([
        new Coordinates(0, 0),
        new Coordinates(51, 21),
        new Coordinates(-51, 25),
        new Coordinates(10, -10),
    ]);

    console.log(coordinatesBounds, coordinatesBounds.getCenter());
    
    response.json({
        message: "ok",
    });
    
//     const coordinates = request.query.coordinates
//         .split(';')
//         .map((x) => x.split(','));
//     console.log(coordinates);
}; 
