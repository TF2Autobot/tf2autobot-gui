import SKU from 'tf2-sku-2';
import { qualityColors, paintCanColors } from '../data';
import SchemaManager from "tf2-schema-2";

/**
 *
 * @param {string} sku item SKU
 * @param schema
 * @return {Object} Item image links - {small: 'link', large: 'link'}
 */
export function getImageFromSKU(sku: string, schema: SchemaManager.Schema): ImageFromSKU {
	const item = SKU.fromString(sku);
	const found = schema.getItemByDefindex(item.defindex);

	if (!found) {
		console.log('Item with defindex ' + item.defindex + ' is not in schema');
		return;
	}
	if ((Object.keys(paintCanColors).indexOf(sku)) > -1) {
		found.image_url = found.image_url_large = `https://steamcommunity-a.akamaihd.net/economy/image/IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdEH9myp0erksICf${paintCanColors[sku]}188x188`;
	} else if (item.paintkit !== null ) {
		found.image_url = found.image_url_large = `https://scrap.tf/img/items/warpaint/${encodeURIComponent(found.item_name)}_${item.paintkit}_${item.wear}_${item.festive===true?1:0}.png`;
	} else if (item.australium === true) {
		found.image_url = found.image_url_large = `https://scrap.tf/img/items/440/${found.defindex}-gold.png`;
	}
	return {
		small: found.image_url,
		large: found.image_url_large,
		effect: item.effect ? `https://marketplace.tf/images/particles/${item.effect}_188x188.png` : ''
	};
};

/**
 * generates colour for items quality
 * @param {String} sku item SKU
 * @param schema
 * @return {Object} {color in hexadecimal string, craflable, image_url, image_url_large}
 */
export function getImageStyle(sku: string, schema: SchemaManager.Schema): ImageStyle {
	const img = getImageFromSKU(sku, schema);
	const item = SKU.fromString(sku);
	const ks = [
		'', // no killstreak
		'KS',
		'SPEC KS',
		'PRO KS'
	];
	return {
		quality_color: qualityColors[item.quality],
		border_color: (item.quality2 != null) ? qualityColors[item.quality2] : '#000000',
		craftable: item.craftable,
		image_small: img.small,
		image_large: img.large,
		effect: img.effect,
		killstreak: ks[item.killstreak]
	};
};

interface ImageFromSKU {
    small: string;
    large: string;
    effect: string
}

interface ImageStyle {
    quality_color: string,
    border_color: string,
    craftable: boolean,
    image_small: string,
    image_large: string,
    effect: string,
    killstreak: string
}
