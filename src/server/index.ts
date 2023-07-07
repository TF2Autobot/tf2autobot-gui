import path from "path";
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });

//require( 'console-stamp' )( console );

import express from 'express';
import initApp from './express/init';
import SchemaManager from '@tf2autobot/tf2-schema';
import BotConnectionManager from "./IPC";
import * as http from "http";
// import {Bot} from "./Bot";
const port = +process.env.PORT;

console.log('tf2autobot-gui v' + require(path.join(process.cwd(), 'package.json')).version + ' is starting...');
const app = express();

const botConnectionManager = new BotConnectionManager();
botConnectionManager.init();

const schemaManager = new SchemaManager({ apiKey: process.env.API_KEY });
schemaManager.init(err => {
    if(err) {
        console.log('Schema manager failed to init, with error: ' + err)
    } else {
        initApp(app, schemaManager, botConnectionManager);
        const httpServer = http.createServer(app);
        httpServer.listen(port);
        console.log(`server listening on port ${port}`);
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
