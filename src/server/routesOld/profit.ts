import * as profit from '../app/profit';
import fs from 'fs-extra';
import paths from '../config/paths';
import express, {Router} from 'express';
import SchemaManager from "@tf2autobot/tf2-schema";

export default function (schemaManager: SchemaManager): Router {
	const router = express.Router();
	const schema = schemaManager.schema;
	router.get('/', (req, res) => {
		if (req.query.json=='true') {
			if (!fs.existsSync(paths.files.polldata)) {
				res.json({
					success: 0
				});
				return;
			}

			/*profit.get(Number(req.query.start), Number(req.query.interval), Number(req.query.end))
				.then((data) => {
					res.json({
						success: 1,
						data
					});
				})
				.catch((err) => {
					throw err;
				});*/
		} else {
			res.render('profit', { user: req.user });
		}
	});
	return router;
}
