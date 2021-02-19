import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { user: req.user });
});

export = router;
