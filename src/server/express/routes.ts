import {Express} from "express";


export = function init(app: Express): void {
    app .use('/', require('../routes'))
        .use('/pricelist', require('../routes/pricelist'));
}
