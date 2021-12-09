import express, {Router} from 'express';
import SchemaManager from "tf2-schema-2";
import BotConnectionManager from "../IPC";
export = function (schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router
        .use('/pricelist', (require('./bot/pricelist'))(schemaManager, botManager))
        .use('/pricelist/item', (require('./bot/item'))(schemaManager, botManager))
    return router;
}
