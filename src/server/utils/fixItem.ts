import { getSchema } from '../app/Schema';

import fixDefindex from './fixDefindex';
import findCrateSeries from './findCrateSeries';
import fixQuality from './fixQuality';

/**
 * Fixes item.
 * @param {Object} sku
 * @return {Object} - Fixed item object
 */
export = (sku) => {
	/**
	 * Naming
	 * item
	 * items
	 * schemaItem
	 * itemFromSchema
	 * gameItem
	 * gameItems
	 */
    const schema = getSchema();
	const schemaItem = schema.getItemByDefindex(sku.defindex);

	if (schemaItem === null) {
		return sku;
	}

	const itemInfo = {
		item: sku,
		items: schema.raw.schema.items,
		schemaItem
	};

	fixDefindex(itemInfo);
	findCrateSeries(itemInfo);
	fixQuality(itemInfo);

	return sku;
};
