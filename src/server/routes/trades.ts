import express, {Router} from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
const router = express.Router();
import * as trades from '../app/trades';
import fs from 'fs-extra';
import paths from '../config/paths';

export = function (schemaManager: SchemaManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.get('/', (req, res) => {
        if (req.query.json!='true') {
            if (!fs.existsSync(paths.files.polldata)) {
                res.render('trades', {
                    data: null,
                    polldata: false
                });
                return;
            }

            res.render('trades', {
                polldata: true,
                user: req.user
            });
        } else {
            if (!fs.existsSync(paths.files.polldata)) {
                res.json({
                    success: 0
                });
                return;
            }

            trades.get(Number(req.query.first), Number(req.query.count), Number(req.query.dir)==1, req.query.search as string, schema)
                .then((data) => {
                    res.json({
                        success: 1,
                        data
                    });
                })
                .catch((err) => {
                    throw err;
                });
        }
    });
    return router;
}
