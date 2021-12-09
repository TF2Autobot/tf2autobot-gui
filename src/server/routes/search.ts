import express, {Router} from 'express';
import searchSchemaByNamePart from '../utils/searchSchemaByNamePart';
import SchemaManager from "tf2-schema-2";

export = function(schemaManager: SchemaManager): Router {
	const router = express.Router();
	const schema = schemaManager.schema;
	router.get('/', (req, res) => {
		const search = decodeURIComponent(req.query.text as string);
		let max = (+req.query.max) || 10;
		const results = searchSchemaByNamePart(search, max, schema);

		res.json({
			results
		});
	});
	return router;
}
