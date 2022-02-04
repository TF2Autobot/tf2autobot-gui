import express, {Router} from 'express';
const router = express.Router();
import Currency from '@tf2autobot/tf2-currencies';
import * as pricelist from '../app/pricelist';
import SchemaManager from "@tf2autobot/tf2-schema";

export = function (schemaManager: SchemaManager): Router {
	const router = express.Router();
	const schema = schemaManager.schema;
	router.post('/', (req, res) => {
		const { name, min, max, intent, sellmetal, sellkeys, buymetal, buykeys, autoprice } = req.body;
		const autopriced = autoprice;

		if (name.includes('classifieds')) {
			res.json({
				success: 0,
				msg: {
					type: 'danger',
					message: 'Please use the items stats page or full name, not the classifieds link'
				}
			});
			return;
		}

		if (parseInt(max) < parseInt(min)) {
			res.json({
				success: 0,
				msg: {
					type: 'warning',
					message: 'Maximum stock can\'t be smaller than the minimum'
				}
			});
			return;
		}

		let sellvalues;
		let buyvalues;
		if (!autopriced) {
			sellvalues = new Currency({
				keys: sellkeys,
				metal: sellmetal
			}).toJSON();

			buyvalues = new Currency({
				keys: buykeys,
				metal: buymetal
			}).toJSON();

			// lower sell keys
			if (sellvalues.keys < buyvalues.keys && intent != 0) {
				res.json({
					success: 0,
					msg: {
						type: 'warning',
						message: 'The sell price must be higher than the buy price'
					}
				});
				return;
			}
			// Same amount of keys, lower or equal sell metal
			if (sellvalues.keys === buyvalues.keys && sellvalues.metal <= buyvalues.metal && intent != 0) {
				res.json({
					success: 0,
					msg: {
						type: 'warning',
						message: 'The sell price must be higher than the buy price'
					}
				});
				return;
			}
		} else { // Autopriced, so dont use values
			sellvalues = {
				keys: 0,
				metal: 0
			};
			buyvalues = {
				keys: 0,
				metal: 0
			};
		}

		pricelist
			.addSingleItem(schema, name, {
				intent: parseInt(intent),
				min: parseInt(min),
				max: parseInt(max),
				buy: buyvalues,
				sell: sellvalues,
				autoprice: autopriced
			})
			.then((result) => {
				const status = {
					success: 1,
					msg: {
						type: 'success',
						message: 'Item was added successfully'
					}
				};

				if (result === false) {
					status.msg.type = 'danger';
					status.msg.message = 'Couldn\'t generate SKU';
				} else if (result > 0) {
					status.msg.type = 'warning';
					status.msg.message = 'Item is already in the pricelist';
				}

				res.json(status);
			})
			.catch((err) => {
				console.log(err);
				res.json({
					success: 0,
					msg: {
						type: 'danger',
						message: 'Error occured'
					}
				});
			});
	});
	return router;
}

