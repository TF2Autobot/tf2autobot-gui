import express, {Express} from 'express';
import initBody from './body';
import initPassport from './passport';
import initNjs from './nunjucks';
import initRoutes from './routes';
import SchemaManager from "tf2-schema-2";
import type BotConnectionManager from "../IPC";

export = function init(app: Express, schemaManager: SchemaManager, botManager: BotConnectionManager): void {
    app.use(express.static('./public'))
    initBody(app);
    if(process.env.STEAM_AUTH) {
        initPassport(app);
    }
    initNjs(app);
    initRoutes(app, schemaManager, botManager);
}
