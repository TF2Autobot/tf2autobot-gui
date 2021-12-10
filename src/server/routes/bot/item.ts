

import express, {Router} from 'express';
import SchemaManager from "tf2-schema-2";
import Currency from "tf2-currencies-2";
import {PricelistItem} from "../../../common/types/pricelist";
import BotConnectionManager from "../../IPC";
import processPricelistItem from "../../utils/processPricelistItem";

function checkItem(item: PricelistItem, res) {
    if (!item.autoprice) {
        // lower sell keys
        if (item.sell.keys < item.buy.keys && item.intent != 0) {
            res.json('The sell price must be higher than the buy price');
            return true;
        }
        // Same amount of keys, lower or equal sell metal
        if (item.sell.keys === item.buy.keys && item.sell.metal <= item.buy.metal && item.intent != 0) {
            res.json('The sell price must be higher than the buy price');
            return true;
        }
    } else { // Autopriced, so dont use values
        item.sell = {
            keys: 0,
            metal: 0
        };
        item.buy = {
            keys: 0,
            metal: 0
        };
    }
    return false;
}

export = function (schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.post('/', (req,res)=>{
        const item = req.body as PricelistItem;
        if(checkItem(item, res)) return;
        botManager.addItem(req.session.bot ,item)
            .then(ret => {
                if(typeof ret === 'object') {
                    res.json( processPricelistItem(ret, schema));
                } else {
                    res.json(typeof ret === "string" ? ret : ""); // make sure r is string
                }
            });
    });
    router.patch('/', (req,res)=>{
        const item = req.body as PricelistItem;
        if(checkItem(item, res)) return;
        botManager.updateItem(req.session.bot, item)
            .then(ret => {
                if(typeof ret === 'object') {
                    res.json( processPricelistItem(ret, schema));
                } else {
                    res.json(typeof ret === "string" ? ret : ""); // make sure r is string
                }
            });
    });
    router.delete('/', (req,res)=>{
        const sku = req.body.sku as string;
        botManager.removeItem(req.session.bot, sku)
            .then(ret => {
                if(typeof ret === 'object') {
                    res.json(ret);
                } else {
                    res.json(typeof ret === "string" ? ret : ""); // make sure r is string
                }
            });
    });
    return router;
}
