import express, {Router} from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
import {PricelistItem} from "../../../common/types/pricelist";
import BotConnectionManager from "../../IPC";
import processPricelistItem from "../../utils/processPricelistItem";
import testSKU from "../../utils/testSKU";

export = function (schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.post('/', (req,res)=>{
        console.log(req.body);
        res.json({});
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

        if (req.body.max - req.body.min < 1) {
            res.json({
                success: 0,
                msg: {
                    type: 'warning',
                    message: 'The maximum stock must be atleast one higher than the minimum'
                }
            });
            return;
        }
        input.forEach(function(item) {
            if (item.includes('classifieds')) {
                res.json({
                    success: 0,
                    msg: {
                        type: 'danger',
                        message: 'Please use the items stats page or full name, not the classifieds link'
                    }
                });
                return;
            }
        });

        if (!req.body.autoprice) {
            const sellvalues = {
                keys: Number(req.body.sell_keys),
                metal: Number(req.body.sell_metal)
            };

            const buyvalues = {
                keys: Number(req.body.buy_keys),
                metal: Number(req.body.buy_metal)
            };

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
        const failedIndexes = [];
        for(let i = 0; i<input.length; i++) {
            const e =input[i];
            let sku = testSKU(e) ? e : schema.getSkuFromName(e);
            if (sku.includes('null') || sku.includes('undefined')) {
                failedIndexes.push(i);
                continue;
            }

        }
        /*
        const item = req.body as PricelistItem;
        if(checkItem(item, res)) return;
        botManager.addItem(req.session.bot ,item)
            .then(ret => {
                if(typeof ret === 'object') {
                    res.json( processPricelistItem(ret, schema));
                } else {
                    res.json(typeof ret === "string" ? ret : ""); // make sure r is string
                }
            });*/
    });
    return router;
}
