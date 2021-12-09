import path from "path";
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });

import express from 'express';
import initApp from './express/init';
import SchemaManager from 'tf2-schema-2';
import BotConnectionManager from "./IPC";
// import {Bot} from "./Bot";
const port = +process.env.PORT;

console.log('tf2autobot-gui v' + require(path.join(process.cwd(), 'package.json')).version + ' is starting...');
const app = express();

// var bots = new Map() as  Map<Number, Bot>;
//
//
// app.use((req, res, next) => {
//     if(req.session.botID && bots.has(req.session.botID) && bots.get(req.session.botID).admins.includes()) {
//
//     } else {
//         res.render('pickBot');
//     }
// });
const botConnectionManager = new BotConnectionManager();
botConnectionManager.init();

const schemaManager = new SchemaManager({apiKey: process.env.API_KEY});
schemaManager.init(err => {
    if(err) {
        console.log('Schema manager failed to init, with error: ' + err)
    } else {
        initApp(app, schemaManager, botConnectionManager);
        app.listen(port);
        console.log('server listening on port ' + port);
    }
})


process
    .on('uncaughtException', (err) => {
        console.log('Received an uncaugh error.');
        console.log(`Error message: ${err.message}`);
        console.log(`Error stack: ${err.stack}`);
        console.log('Please report this bug @ https://github.com/TF2Autobot/tf2autobot-gui/issues/new');
    })
    .on('unhandledRejection', (reason, p) => {
        console.log('Received an unhandled rejection.');
        console.log(p);
        console.log('Please report this @ https://github.com/TF2Autobot/tf2autobot-gui/issues/new');
    });
