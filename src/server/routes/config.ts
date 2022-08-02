import express, { Router } from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
import BotConnectionManager from "../IPC";
/***
 * Function that converts val to the same type as is on source
 * @param source
 * @param val
 */
function toType(source, val) {
    switch (typeof source) {
    case 'boolean':
        return val==='true' ? true : val === 'false' ? false : source;
    case 'number':
        return Number(val);
    case 'string':
        return String(val);
    case 'undefined':
        return undefined;
    default:
    case 'object':
        return typeof val === 'string' ? JSON.parse(val) : val;
    }
}

export default function config(schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    router.get('/', async (req, res) => {
        res.render('config');
    });
    router.get('/options', async (req, res) => {
        res.json(await botManager.getOptions(req.session.bot));
    });
    router.post('/', async (req, res) => {
        const botOptions = await botManager.getOptions(req.session.bot);
        const object = {};
        for(const key in req.body) {
            if(!Object.prototype.hasOwnProperty.call(req.body, key)) {
                continue;
            }
            const val = req.body[key];
            const keys = key.split('$');
            let obj = object;//copy reference
            let opt = botOptions;//copy reference
            let lastKey;

            for(const key of keys) {
                if(lastKey) {
                    if(!obj[lastKey]) {
                        obj[lastKey] = {};
                    }
                    obj=obj[lastKey];
                    opt=opt[lastKey];
                }
                lastKey=key; //reference child object
            }
            if(lastKey) {
                obj[lastKey]=isNaN(val) ? val : +val; //update value in referenced object, thus in base object
                opt[lastKey]=toType(opt[lastKey], val);
            } else {
                console.error('LastKey not set ?');
            }
        }
        await botManager.updateOptions(req.session.bot, botOptions);
        // TODO: display errors
        res.redirect('/config');
    });
    return router;
}
