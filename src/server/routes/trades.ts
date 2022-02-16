import express, {Router} from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
const router = express.Router();
import * as trades from '../app/trades';
import fs from 'fs-extra';
import paths from '../config/paths';
import BotConnectionManager from "../IPC";

export = function (schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.get('/', async (req, res) => {
        if (req.accepts('text/html')) {
            res.render('trades', {
                polldata: true,
                user: req.user
            });
        } else if(req.accepts('application/json')){
            const polldata = await botManager.getTrades(req.session.bot);
            trades.get(Number(req.query.first)||0, Number(req.query.count)||50, Number(req.query.dir)==1, (req.query.search ?? '') as string, schema, polldata)
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
    router.get('/stats', async (req, res)=>{
        res.send(`<pre>${await botManager.sendChat(req.session.bot, "!stats")}</pre>`);
    })
    return router;
}
