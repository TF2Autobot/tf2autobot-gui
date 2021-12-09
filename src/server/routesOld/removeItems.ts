import express from 'express';
const router = express.Router();
import * as pricelist from '../app/pricelist';

router.post('/', async (req, res) => {
	const items = req.body.list;

	pricelist
		.removeItems(items)
		.then((removed) => {
			const amountRemoved = (removed === false) ? 0 : removed;
			const message = `Sucessfully removed ${amountRemoved} ${amountRemoved == 1 ? 'item' : 'items'}`;
			res.json({
				status: 1,
				msg: {
					type: 'success',
					message: message
				}
			});
		})	.catch((err) => {
			throw err;
		});
});

export = router;
