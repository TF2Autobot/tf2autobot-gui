import path from "path";
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });

//require( 'console-stamp' )( console );

import express from 'express';
import initApp from './express/init';
import SchemaManager from '@tf2autobot/tf2-schema';
import BotConnectionManager from "./IPC";
import fs from "fs";
import * as https from "https";
import * as http from "http";
// import {Bot} from "./Bot";
const port = +process.env.PORT;
const portHttps = +process.env.PORT_HTTPS;
const portNginx = +process.env.PORT_NGINX;

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

import { apiRequest } from './utils/apiRequest';

// Make the schema manager request the schema from schema.autobot.tf

/*eslint-disable */
SchemaManager.prototype.getSchema = function (callback): void {
    apiRequest('GET', 'https://schema.autobot.tf/schema')
        .then(schema => {
            this.setSchema(schema, true);
            callback(null, this.schema);
        })
        .catch(err => {
            callback(err);
        });
};
/*eslint-enable */

const schemaManager = new SchemaManager({ apiKey: process.env.API_KEY });
schemaManager.init(err => {
    if(err) {
        console.log('Schema manager failed to init, with error: ' + err)
    } else {
        initApp(app, schemaManager, botConnectionManager);
        if(process.env.SSL === 'true') {
            const credentials = {
                key: fs.readFileSync(process.env.CERT_KEY || 'local.key', 'utf8'),
                cert: fs.readFileSync(process.env.CERT_FILE || 'local.crt', 'utf8')
            };
            const httpsServer = https.createServer(credentials, app);
            httpsServer.listen(portNginx || portHttps, portNginx ? "127.0.0.1" : undefined);
        } else {
            const httpServer = http.createServer(app);
            httpServer.listen(port);
        }
        console.log(`server listening on port ${process.env.SSL === 'true' ? portHttps : port}`);
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
