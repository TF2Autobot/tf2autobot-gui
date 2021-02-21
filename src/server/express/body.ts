import {Express} from "express";
import bodyParser from "body-parser";
import session from "express-session";

export = function init(app: Express): void {
    app.use(bodyParser.json())
        .use(bodyParser.urlencoded({
            extended: false
        }))
        .use(session({
            secret: 'your secret',
            name: 'name of session id',
            resave: true,
            saveUninitialized: true }))
}
