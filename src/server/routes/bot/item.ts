import express, {Router} from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
import {PricelistItem} from "../../../common/types/pricelist";
import BotConnectionManager from "../../IPC";
import processPricelistItem from "../../utils/processPricelistItem";
import {checkItem} from "./checkItem";

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
