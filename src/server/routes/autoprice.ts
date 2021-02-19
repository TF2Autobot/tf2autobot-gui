import express from 'express';
const router = express.Router();
import axios from 'axios';

router.get('/', (req, res) => {
	if (!req.query.sku || !isSKU(req.query.sku as string)) {
		res.json({
			success: false
		});
		return;
	}
	axios({
		method: 'get',
		url: `https://api.prices.tf/items/${req.query.sku}`,
		params: {
			src: 'bptf'
		},
		responseType: 'json'
	})
		.then((resp) => {
			res.json(resp.data);
		})
		.catch((err) => {
			res.json({
				success: false
			});
		});
});

export = router;

function isSKU(str: string): boolean {
	return str.split(';').length > 1 && Number.isInteger(Number(str.split(';')[0])) && Number.isInteger(Number(str.split(';')[1]));
}
