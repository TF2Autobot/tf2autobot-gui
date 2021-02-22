import * as data from '../lib/data';
import SKU from 'tf2-sku-2';
import { Item } from '../types/TeamFortress2';
import SchemaManager from "tf2-schema-2";

/**
 *
 * @param {(string|Object)} item - SKU or item object
 * @param schema
 * @return {string} - Full bptf stats link
 */
export default function getStatsLink(item: Item | string, schema: SchemaManager.Schema): string {
	// If its a sku and not an item object
	if (typeof item === 'string') {
		item = SKU.fromString(item);
	}

	const schemaItem = schema.getItemByDefindex(item.defindex);
	if (!schemaItem) {
		return null;
	}

	let url = 'https://backpack.tf/stats/' + data.quality[item.quality] + '/';

	if (item.festive) {
		url += 'Festivized ';
	}

	if (item.killstreak > 0) {
		url += data.killstreak[item.killstreak] + ' ';
	}

	if (item.paintkit) {
		url += data.skin[item.paintkit] + ' ';
	}

	if (item.australium) {
		url += 'Australium ';
	}

	url += schemaItem.item_name;

	if (item.wear) {
		data.wear[item.wear];
	}

	url += '/Tradable/';
	url += item.craftable ? 'Craftable/' : 'Non-Craftable/';

	if (item.effect) {
		url += item.effect;
	}

	return url;
}
