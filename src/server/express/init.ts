import express, {Express} from 'express';
import initBody from './body';
import initPassport from './passport';
import initNjs from './nunjucks';
import initRoutes from './routes';
import SchemaManager from "@tf2autobot/tf2-schema";
import type BotConnectionManager from "../IPC";
import config from "../routes/config";

export = function init(app: Express, schemaManager: SchemaManager, botManager: BotConnectionManager): void {
    app.use(express.static('./public'))
    app.use('/', config(schemaManager, botManager))
    initBody(app);
    if(process.env.STEAM_AUTH) {
        initPassport(app, botManager);
    }
    initNjs(app);
    initRoutes(app, schemaManager, botManager);
}
