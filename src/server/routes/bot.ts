import express, {Router} from 'express';
import SchemaManager from "tf2-schema-2";
export = function (schemaManager: SchemaManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router
        .use('/pricelist', (require('./bot/pricelist'))(schemaManager))
        .use('/pricelist/item', (require('./bot/item'))(schemaManager))
    return router;
}
