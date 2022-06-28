import express, {Router} from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";
const router = express.Router();
import * as trades from '../app/trades';
import fs from 'fs-extra';
import paths from '../config/paths';
import BotConnectionManager from "../IPC";

export default function config(schemaManager: SchemaManager, botManager: BotConnectionManager): Router {
    const router = express.Router();
    router.get('/', async (req, res) => {
        res.render('config');
    });
    return router;
}
