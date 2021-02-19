import fs from 'fs-extra';
import axios from 'axios';
import SKU from 'tf2-sku-2';
import SchemaManager from 'tf2-schema-2'
import paths from '../config/paths';


let schema: SchemaManager.Schema;
export async function init(): Promise<void> {
	const method = fs.existsSync(paths.files.schema) ? getSchemaFromFile : fetchSchema;

	const responseSchema = await method();
    schema = responseSchema;
    return await Promise.resolve();
};

/**
 * Gets schema from file
 * @return {Object} schema
 */
async function getSchemaFromFile(): Promise<SchemaManager.Schema> {
	try {
        return fs.readJSON(paths.files.schema);
    } catch (err) {
        return await Promise.reject(
            new Error('Couldn\'t read schema file: ' + err.message)
        );
    }
};

/**
 * Gets schema from API
 * @return {Object} schema
 */
async function fetchSchema(): Promise<SchemaManager.Schema> {
	try {
        const response = await axios(
            {
                url: 'https://api.prices.tf/schema',
                method: 'GET',
                params: {
                    appid: 440
                },
                responseType: 'json'
            }
        );
        fs.writeJSON(paths.files.schema, response.data);
        return response.data;
    } catch (err) {
        return await Promise.reject(
            new Error('Couldn\'t get schema from prices.tf API: ' + err.message)
        );
    }
};

export function getSchema() {
	return schema;
};

/**
 * Binary search for item in schema
 * @param {String} defindex defindex of item
 * @return {Object} schemaItem / null if not found
 */
export function getItemByDefindex(defindex: number): SchemaManager.SchemaItem {
	const items = schema.raw.schema.items;
	let found: SchemaManager.SchemaItem;
	let start = 0;
	let end = items.length - 1;

	while (start <= end) {
		const mid = Math.floor((start + end) / 2);
		if (items[mid].defindex < defindex) {
			start = mid + 1;
		} else if (items[mid].defindex > defindex) {
			end = mid - 1;
		} else {
			found = items[mid];
			break;
		}
	}
	return found;
};

/**
 * Binary search for item in schema
 * @param {String} sku sku of item
 * @return {Object} schemaItem / null if not found
 */
export function getItemBySKU(sku: string): SchemaManager.SchemaItem {
	return getItemByDefindex(SKU.fromString(sku).defindex);
};
