// 'use strict';

// import path from 'path';

// import fs from 'fs-extra';

// import express from './app/ExpressApp';

// let port = process.env.PORT ? process.env.PORT : 3000;

// import paths from './config/paths';

// console.log('tf2autobot-gui v' + require(paths.files.package).version + ' is starting...');


// if (!fs.existsSync(paths.files.pricelist)) {
// 	throw new Error('Missing pricelist - Please put your pricelist file in the config folder');
// }

// if (isNaN(+port)) {
// 	console.log(`WARNING: You've set port to a non-number, resetting to port 3000.`);
// 	port = 3000;
// }


import path from "path";
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });

import express from 'express';
import initApp from './express/init';
import SchemaManager from 'tf2-schema-2';
// import {Bot} from "./Bot";
const port = 3000;



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
const schemaManager = new SchemaManager({apiKey: process.env.API_KEY});
schemaManager.init(err => {
    if(err) {
        console.log('Schema manager failed to init, with error: ' + err)
    } else {
        initApp(app, schemaManager);
        app.listen(+port);
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

import BotConnectionManager from "./IPC";

const botConnectionManager = new BotConnectionManager();
botConnectionManager.init();
