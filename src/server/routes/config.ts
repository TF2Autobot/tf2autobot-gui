import express, { Router } from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
import BotConnectionManager from "../IPC";

export default function config(schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    router.get('/', async (req, res) => {
        res.render('config');
    });
    router.post('/', async (req, res) => {
        const object = {};
        for(const key in req.body) {
            if(!Object.prototype.hasOwnProperty.call(req.body, key)) {
                continue;
            }
            const val = req.body[key];
            const keys = key.split('.');
            let obj = object;
            let lastKey;

            for(const key of keys) {
                if(lastKey) {
                    if(!obj[lastKey]) {
                        obj[lastKey] = {};
                    }
                    obj=obj[lastKey];
                }
                lastKey=key;
            }
            if(lastKey) {
                obj[lastKey]=val;
            } else {
                console.error('LastKey not set ?');
            }
        }
        console.log(JSON.stringify(object));
        res.redirect('/config');
    });
    return router;
}
