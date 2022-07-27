import { Express } from "express";
import SchemaManager from "@tf2autobot/tf2-schema";
import BotConnectionManager from "../IPC";

export default function init(app: Express, schemaManager: SchemaManager, botManager: BotConnectionManager): void {
    app .use('/', require('../routes')(schemaManager, botManager))
        .use('/bot/:id(\\d+)', (req, res, next) => {
            req.botID = req.params.id;
            next();
        }, require('../routes/bot')(schemaManager))
        .use('/auth', require('../routes/auth'))
        .use('/search', require('../routes/search')(schemaManager))
}
