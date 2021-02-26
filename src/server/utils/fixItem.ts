import fixDefindex from './fixDefindex';
import findCrateSeries from './findCrateSeries';
import fixQuality from './fixQuality';
import SchemaManager from "tf2-schema-2";

/**
 * Fixes item.
 * @param {Object} sku
 * @return {Object} - Fixed item object
 */
export = (sku, schema: SchemaManager.Schema) => {
	/**
	 * Naming
	 * item
	 * items
	 * schemaItem
	 * itemFromSchema
	 * gameItem
	 * gameItems
	 */
	const schemaItem = schema.getItemByDefindex(sku.defindex);

	if (schemaItem === null) {
		return sku;
	}

	const itemInfo = {
		item: sku,
		items: schema.raw.schema.items,
		schemaItem
	};

	fixDefindex(itemInfo, schema);
	findCrateSeries(itemInfo, schema);
	fixQuality(itemInfo);

	return sku;
};
