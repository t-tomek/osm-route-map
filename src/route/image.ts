import {
    Request,
    Response,
} from "express";

import Point from "../common/geometry/point";
import Bounds from "../common/geometry/bounds";

export const generate = (request: Request, response: Response) => {
    console.log('generating...');

    const point1 = new Point(-40, -10);
    const point2 = new Point(0, 0);
    const point3 = new Point(50, -50);
    const point4 = new Point(25, 25);

    const bounds = new Bounds([point1, point2, point3, point4]);

    console.log(bounds.getBottomLeft());
    console.log(bounds.getTopRight());
    console.log(bounds.getTopLeft());
    console.log(bounds.getBottomRight());
    console.log(bounds.getSize());

    console.log(bounds.getCenter());
    
    response.json({
        message: "ok",
    });
    
//     const coordinates = request.query.coordinates
//         .split(';')
//         .map((x) => x.split(','));
//     console.log(coordinates);
}; 
