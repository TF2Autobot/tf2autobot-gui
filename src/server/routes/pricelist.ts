import express, {Router} from 'express';
import getStatsLink from "../utils/getStatsLink";
import Currency from "tf2-currencies-2";
import {getImageStyle} from "../utils/getImage";
import {Pricelist} from "../../common/types/pricelist";
import SchemaManager from "tf2-schema-2";
import SKU from 'tf2-sku-2';

export = function (schemaManager: SchemaManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.get('/', (req, res) => {
        const pricelist = [
            {
                "sku": "1099;6",
                "enabled": true,
                "autoprice": true,
                "max": 1,
                "min": 0,
                "intent": 1,
                "name": "The Tide Turner",
                "buy": {
                    "keys": 0,
                    "metal": 0.05
                },
                "sell": {
                    "keys": 0,
                    "metal": 0.11
                },
                "time": 1613838326
            },
            {
                "sku": "593;6",
                "enabled": true,
                "autoprice": true,
                "max": 1,
                "min": 0,
                "intent": 1,
                "name": "The Third Degree",
                "buy": {
                    "keys": 0,
                    "metal": 0.05
                },
                "sell": {
                    "keys": 0,
                    "metal": 0.11
                },
                "time": 1613838135
            },
            {
                "sku": "1101;6",
                "enabled": true,
                "autoprice": true,
                "max": 1,
                "min": 0,
                "intent": 1,
                "name": "The B.A.S.E. Jumper",
                "buy": {
                    "keys": 0,
                    "metal": 0.05
                },
                "sell": {
                    "keys": 0,
                    "metal": 0.11
                },
                "time": 1613838096
            }
        ] as Pricelist;
        const keyPrice = 56; //TODO fetch
        for (let i = 0; i < pricelist.length; i++) {
            const item = pricelist[i];
            if (!item.name) {

                item.name = schema.getName(SKU.fromString(item.sku));
            }
            item.statslink = getStatsLink(item.sku, schema);
            [item.buy, item.sell].forEach((prices)=>{
                const currency = new Currency({
                    metal: prices.metal,
                    keys: prices.keys
                })
                prices.total = currency.toValue(keyPrice);
                prices.string = currency.toString();
            });
            item.style = getImageStyle(item.sku, schema);
        }
        res.json({
            pricelist
        });
    });
    return router;
}
