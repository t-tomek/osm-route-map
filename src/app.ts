import express from "express";
import * as routeImage from "./route/image";
const app = express();

app.set("port", process.env.PORT || 3000);
app.get("/", routeImage.generate);

export default app;
