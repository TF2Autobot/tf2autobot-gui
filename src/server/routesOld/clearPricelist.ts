import express from 'express';
const router = express.Router();
import * as pricelist from '../app/pricelist';

router.post('/', (req, res) => {
	pricelist
		.clear()
		.then(() => {
			res.json({
				success: 1,
				msg: {
					type: 'success',
					message: 'Pricelist has been cleared'
				}
			});
		})
		.catch((err) => {
			throw err;
		});
});

export = router;
