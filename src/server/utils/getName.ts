import { getSchema } from '../app/Schema';
import * as data from '../lib/data';
import SKU from 'tf2-sku-2';
import { Item } from '../types/TeamFortress2';

export default function getName(item: Item, proper = true): string {
	// If its a sku and not an item object
    const schema = getSchema();

	if (typeof item === 'string') {
		item = SKU.fromString(item);
	}

	const schemaItem = schema.getItemByDefindex(item.defindex);
	if (!schemaItem) {
		return null;
	}

	let name = '';

	if (item.tradable === false) {
		name = 'Non-Tradable ';
	}

	if (item.craftable === false) {
		name += 'Non-Craftable ';
	}

	if (item.quality2) {
		// Elevated quality
		name += data.quality[item.quality2] + ' ';
	}

	if ((item.quality !== 6 && item.quality !== 15 && item.quality !== 5) || (item.quality === 5 && !item.effect) || schemaItem.item_quality == 5) {
		// If the quality is not Unique, Decorated, or Unusual, or if the quality is Unusual but it does not have an effect, or if the item can only be unusual, then add the quality
		name += data.quality[item.quality] + ' ';
	}

	if (item.festive === true) {
		name += 'Festivized ';
	}

	if (item.effect) {
		name += data.effect[item.effect] + ' ';
	}

	if (item.killstreak && item.killstreak > 0) {
		name += ['Killstreak', 'Specialized Killstreak', 'Professional Killstreak'][item.killstreak - 1] + ' ';
	}

	if (item.target) {
		name += schema.getItemByDefindex(item.target).item_name + ' ';
	}

	if (item.outputQuality && item.outputQuality !== 6) {
		name = data.quality[item.outputQuality] + ' ' + name;
	}

	if (item.output) {
		name += schema.getItemByDefindex(item.output).item_name + ' ';
	}

	if (item.australium === true) {
		name += 'Australium ';
	}

	if (item.paintkit) {
		name += data.skin[item.paintkit] + ' ';
	}

	if (proper === true && name === '' && schemaItem.proper_name == true) {
		name = 'The ';
	}

	name += schemaItem.item_name;

	if (item.wear) {
		name += ' (' + ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle Scarred'][item.wear - 1] + ')';
	}

	if (item.crateseries) {
		name += ' #' + item.crateseries;
	}

	return name;
}
