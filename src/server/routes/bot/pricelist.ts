import express, {Router} from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
import BotConnectionManager from "../../IPC";
import processPricelistItem from '../../utils/processPricelistItem';

export = function (schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.get('/', async (req, res) => {
        //botManager
        let pricelist
        try {
            pricelist = await botManager.getBotPricelist(req.session.bot);// fs.readJSONSync(paths.files.pricelist) as Pricelist; //TODO fetch from bot
        } catch (e) {
            console.error(e);
        }
        if(!pricelist) return res.json([]);
        pricelist = Object.values(pricelist);
        for (let i = 0; i < pricelist.length; i++) {
            const item = pricelist[i];
            pricelist[i] = processPricelistItem(item, schema);
        }
        res.json(
            pricelist
        );
    });
    return router;
}
