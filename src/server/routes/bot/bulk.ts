import express, {Router} from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
import {PricelistItem} from "../../../common/types/pricelist";
import BotConnectionManager from "../../IPC";
import processPricelistItem from "../../utils/processPricelistItem";
import testSKU from "../../utils/testSKU";

export = function (schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.post('/', async (req,res)=>{
        console.log(req.body);
        console.log('herre')
        const input = req.body.input.split(/\r?\n/);

        if (req.body.max - req.body.min < 0) {
            res.json({
                success: 0,
                msg: {
                    type: 'warning',
                    message: 'Maximum stock can\'t be smaller than the minimum'
                }
            });
            return;
        }
        const  sellvalues = {
            keys: 0,
            metal: 0
        };
        const buyvalues = {
            keys: 0,
            metal: 0
        };
        if (!req.body.autoprice) {
            sellvalues.keys = Number(req.body.sell_keys);
            sellvalues.metal = Number(req.body.sell_metal);

            buyvalues.keys =  Number(req.body.buy_keys);
            buyvalues.metal = Number(req.body.buy_metal);

            // lower sell keys
            if (sellvalues.keys < buyvalues.keys && req.body.intent != 0) {
                res.json({
                    success: 0,
                    msg: {
                        type: 'warning',
                        message: 'The sell price must be higher than the buy price'
                    }
                });
                return;
            }
            // Same amount of keys, lower or equal sell metal
            if (sellvalues.keys === buyvalues.keys && sellvalues.metal <= buyvalues.metal && req.body.intent != 0) {
                res.json({
                    success: 0,
                    msg: {
                        type: 'warning',
                        message: 'The sell price must be higher than the buy price'
                    }
                });
                return;
            }
        }
        const failed: {[id: number]: string} = {};
        const items: PricelistItem[] = [];
        for(let i = 0; i<input.length; i++) {
            const e =input[i];
            let sku = testSKU(e) ? e : schema.getSkuFromName(e);
            if (sku.includes('null') || sku.includes('undefined')) {
                failed[e] = 'Invalid sku or name';
                continue;
            }
            items.push({
                sku,
                max: req.body.max,
                min: req.body.min,
                intent: Number(req.body.intent),
                buy: buyvalues,
                sell: sellvalues,
                promoted: 0, //ADD
                note: {
                    buy: '',
                    sell: ''
                }, //ADD
                group: req.body.group, //ADD
                autoprice: req.body.autoprice,
                enabled: true,
                time: Date.now()
            });
        }
        const addRes = await Promise.all(items.map(item =>  botManager.addItem(req.session.bot, item)));
        const success = [];
        for (const item of addRes) {
            if(typeof item !== 'object') {
                failed[item] = typeof item === "string" ? item : ""; // make sure r is string
            }
        }
        if(Object.keys(failed).length > 0) {
            res.json({
                success: 0,
                msg: {
                    type: 'warning',
                    message: Object.keys(failed).map(key=>`${key}: ${failed[key]}`).join('\n')
                }
            });
        }
        else res.json({success: 1, msg: {type: 'success',message: 'ok'}})
    });
    return router;
}
