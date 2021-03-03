

import express, {Router} from 'express';
import SchemaManager from "tf2-schema-2";
import Currency from "tf2-currencies-2";
import {PricelistItem} from "../../common/types/pricelist";

export = function (schemaManager: SchemaManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.get('/', (res,req)=>{

    });
    router.post('/', (req,res)=>{
        const item = req.body as PricelistItem;
        if (!item.autoprice) {
            // lower sell keys
            if (item.sell.keys < item.buy.keys && item.intent != 0) {
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
            if (item.sell.keys === item.buy.keys && item.sell.metal <= item.buy.metal && item.intent != 0) {
                res.json({
                    success: 0,
                    msg: {
                        type: 'warning',
                        message: 'The sell price must be higher than the buy price'
                    }
                });
                return;
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
    });
    router.patch('/', (res,req)=>{

    });
    router.delete('/', (res,req)=>{

    });
    return router;
}
