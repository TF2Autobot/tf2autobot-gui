import express, {Router} from 'express';
import getStatsLink from "../../utils/getStatsLink";
import Currency from "tf2-currencies-2";
import {getImageStyle} from "../../utils/getImage";
import {Pricelist} from "../../../common/types/pricelist";
import SchemaManager from "tf2-schema-2";
import SKU from 'tf2-sku-2';
import paths from '../../config/paths';
import fs from "fs-extra";

export = function (schemaManager: SchemaManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.get('/', (req, res) => {
        const pricelist = fs.readJSONSync(paths.files.pricelist) as Pricelist; //TODO fetch from bot
        const keyPrice = 56; //TODO fetch from bot
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
    router.post('/', (req, res)=>{

    });
    router.patch('/', (req, res)=>{

    });
    router.delete('/', (req, res)=>{

    });
    return router;
}
