import express from 'express';
const router = express.Router();
import searchSchemaByNamePart from '../utils/searchSchemaByNamePart';

router.get('/', (req, res) => {
	const search = decodeURIComponent(req.query.text as string);
	let max = 10;
	if (!req.query.max) {
		max = parseInt(req.query.max as string);
	}
	const results = searchSchemaByNamePart(search, max);
	
	res.json({
		results
	});
});

export = router;
