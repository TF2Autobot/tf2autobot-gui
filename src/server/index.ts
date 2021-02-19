'use strict';

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

import fs from 'fs-extra';
import * as Schema from './app/Schema';
import express from './app/ExpressApp';

let port = process.env.PORT ? process.env.PORT : 3000;

import paths from './config/paths';

console.log('tf2autobot-gui v' + require(paths.files.package).version + ' is starting...');


if (!fs.existsSync(paths.files.pricelist)) {
	throw new Error('Missing pricelist - Please put your pricelist file in the config folder');
}

if (isNaN(+port)) {
	console.log(`WARNING: You've set port to a non-number, resetting to port 3000.`);
	port = 3000;
}

Schema.init()
	.then(() => {
		express.listen(+port);
	})
	.catch((err) => {
		throw err;
	});


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
