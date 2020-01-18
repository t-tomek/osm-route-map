import {
    Request,
    Response,
} from "express";

import httpRequest from "request-promise-native";

import Point from "../common/geometry/point";
import Coordinates from "../common/geo/coordinates";
import CoordinatesBounds from "../common/geo/coordinatesBounds";
import Map from "../common/map";
import GridLayer from "../common/layer/tile/gridLayer";
import sharp from "sharp";

const width = 2000;
const height = 700;

export const generate = async (request: Request, response: Response) => {
    const map = new Map({
        width,
        height,
        // center: new Coordinates(52, 19),
        // zoom: 4,
        maxZoom: 19,
        minZoom: 1,
    });


    const points = [
        new Coordinates(51.1089776,17.0326689),
        new Coordinates(51.15528106689453,16.902198791503906),
        new Coordinates(51.073702, 16.884238)
    ];

    const bounds = new CoordinatesBounds(points);

    const grid = new GridLayer(map);
    const centerZoom = map.getBoundsCenterZoom(bounds);

    map.setZoom(centerZoom.zoom);


    const data = grid.draw2(centerZoom.center, centerZoom.zoom);


    const osmTileImageRequest = httpRequest.defaults({
        encoding: null,
    });


 
    const image = sharp({
        create: {
            width: data.imageSize.x,
            height: data.imageSize.y,
            channels: 3,
            background: {
                r: 255,
                g: 255,
                b: 255
            },
        }
    });

    const responses = await Promise.all(
        data.tiles.map(({url}: any) => {
            return osmTileImageRequest.get(url);
        })
    );

    let i = 0;

    image
        .composite(
            responses.map((input: Buffer) => {
                return {
                    input,
                    left: data.tiles[i].offset.y,
                    top: data.tiles[i++].offset.x,
                };
            })
        )
        .png()
    ;

    const newImage = await image.toBuffer();
    const b = sharp(newImage);
    console.log(data.offset)

    b
        .extract({
            left: data.offset.x,
            top: data.offset.y,
            width,
            height
        })
        // .resize(200, 300, {
        //     // kernel: sharp.kernel.nearest,
        //     // fit: 'contain',
        //     // position: 'right top',
        //     background: { r: 255, g: 255, b: 255, alpha: 0.5 }
        // })
        .png()
        .toBuffer((error, data) => {
            response.type('image/png');
            response.send(data);
        })
        
    // response.send(grid.draw(centerZoom.center, centerZoom.zoom, points).tiles);
    // response.end();

    // response.json({
        // ...data
        // centerZoom,
        // grid: grid.draw(centerZoom.center, centerZoom.zoom)
    // });
    
//     const coordinates = request.query.coordinates
//         .split(';')
//         .map((x) => x.split(','));
//     console.log(coordinates);
}; 

