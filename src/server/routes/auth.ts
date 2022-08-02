import express from 'express';
const router = express.Router();
import passport from 'passport';

// GET /auth/steam & GET /auth/steam/return
router.get(/^\/steam(\/return)?$/, (req, res, next) => {
	req.url = req.originalUrl;
	next();
},
passport.authenticate('steam', {
	failureRedirect: '/'
}),
(req, res) => {
	res.redirect('/home');
});

export = router;
