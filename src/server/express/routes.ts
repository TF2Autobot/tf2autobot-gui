import {Express} from "express";
import SchemaManager from "tf2-schema-2";


export = function init(app: Express, schemaManager: SchemaManager): void {
    app .use('/', require('../routes'))
        .use('/pricelist', (require('../routes/pricelist'))(schemaManager))
        .use('/auth', require('../routes/auth'))
}
