import express from 'express';
const router = express.Router();
import paths from '../config/paths';
import fs from 'fs-extra';
import getName from '../utils/getName';
import { getImageStyle } from '../utils/getImage';
import getStatsLink from '../utils/getStatsLink';
import axios from 'axios';
import Currency from 'tf2-currencies-2';

let lastKeyCheck = 0;
let lastKeyPrice = 0;

router.get('/', (req, res) => {
	fs.readJSON(paths.files.pricelist)
		.then((pricelist) => {
			if (Date.now() - lastKeyCheck > 30 * 60 * 1000) { // update keyprice every 30 minutes and keep it in memory
				lastKeyCheck = Date.now();
				axios({
					url: 'https://api.prices.tf/items/5021;6',
					method: 'GET',
					params: {
						src: 'bptf'
					},
					responseType: 'json'
				}).then(({ data }) => {
					if (!data.success) {
						throw new Error('Couldn\'t get key price from pricestf: ' + data.message);
					}
					lastKeyPrice = data.sell.metal;
					servePricelist(lastKeyPrice, pricelist, res);
				});
			} else {
				servePricelist(lastKeyPrice, pricelist, res);
			}
		})
		.catch((err) => {
			throw err;
		});
});

export = router;

/**
 * 
 * @param {Number} keyPrice price of key in metal
 * @param {Object} pricelist pricelist form file
 * @param {Object} res response to act on
 */
function servePricelist(keyPrice, pricelist, res) {
	for (let i = 0; i < pricelist.length; i++) {
		const item = pricelist[i];
		if (!item.name) {
			item.name = getName(item.sku);
		}
		item.statslink = getStatsLink(item.sku);
		item.buy.total = new Currency({
			metal: item.buy.metal,
			keys: item.buy.keys
		}).toValue(keyPrice); // convert buy price to scrap with actual key value to scrap for sorting purposes
		item.buy.string = new Currency({
			metal: item.buy.metal,
			keys: item.buy.keys
		}).toString();
		item.sell.total = new Currency({
			metal: item.sell.metal,
			keys: item.sell.keys
		}).toValue(keyPrice); // convert sell price to scrap with actual key value to scrap for sorting purposes
		item.sell.string = new Currency({
			metal: item.sell.metal,
			keys: item.sell.keys
		}).toString();
		item.style = getImageStyle(item.sku);
	}
	res.json({
		pricelist
	});
}
