import express, {Router} from 'express';
import SchemaManager from "tf2-schema-2";
import BotConnectionManager from "../../IPC";
import processPricelistItem from '../../utils/processPricelistItem';

export = function (schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    const schema = schemaManager.schema;
    router.get('/', async (req, res) => {
        //botManager
        let pricelist
        try {
            pricelist = await botManager.getBotPricelist(process.env.BOT_ID);// fs.readJSONSync(paths.files.pricelist) as Pricelist; //TODO fetch from bot
        } catch (e) {
            console.error(e);
        }
        if(!pricelist) res.json([]);
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
