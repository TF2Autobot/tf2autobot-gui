import { Express } from "express";
import SchemaManager from "@tf2autobot/tf2-schema";
import BotConnectionManager from "../IPC";

export default function init(app: Express, schemaManager: SchemaManager, botManager: BotConnectionManager): void {
    app.get('/', (req, res) => {
        res.render('landing');
    });    
}
