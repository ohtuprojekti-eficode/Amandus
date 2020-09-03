import * as express from "express";


const app = express();
app.use(express.static(__dirname));
app.listen(4200);