// Handles express side of things

import path from 'path';
import express from 'express';
const app = express();

import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import StrategyPassport from 'passport-steam';

const SteamStrategy = StrategyPassport.Strategy

let port = process.env.PORT ? process.env.PORT : 3000;

if (isNaN(+port)) {
	port = 3000;
}

// Maybe just require in the app.use instead of vars
import index from '../routes/index';
import removeItems from '../routes/removeItems';
import addItem from '../routes/addItem';
import addItems from '../routes/addItems';
import trades from '../routes/trades';
import changeItem from '../routes/changeItem';
import clearPricelist from '../routes/clearPricelist';
import search from '../routes/search';
import getItems from '../routes/getItems';
import profit from '../routes/profit';
import autoprice from '../routes/autoprice';
import authRoutes from '../routes/auth';

passport.serializeUser(function(user, done) {
	done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

const publicIp = require('public-ip');

(async () => {
	let ip = process.env.ADDRESS;
	if (process.env.VPS == 'true' && !ip) {
		try {
			ip = await publicIp.v4();
		} catch (err) {
			console.log('ipV4 unavailable, cant run');
			process.exit(1);
		}
	}
	console.log( 'app is available at: ' + (process.env.VPS == 'true' ? `http://${ip}:${port}/` : `http://127.0.0.1:${port}/`) );
	passport.use(new SteamStrategy({
		returnURL: process.env.VPS == 'true' ? `http://${ip}:${port}/auth/steam/return` : `http://127.0.0.1:${port}/auth/steam/return`,
		realm: process.env.VPS == 'true' ? `http://${ip}:${port}/` : `http://127.0.0.1:${port}/`,
		apiKey: process.env.API_KEY
	},
	function(identifier, profile, done) {
		// Always return profile, dont want constant logins if not an admin
		profile.identifier = identifier;
		return done(null, profile);
	}
	));
})();

app
	.use(express.static(path.join(__dirname, '../assets')))
	.set('views', path.join(__dirname, '../views'))
	.set('view engine', 'ejs')
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({
		extended: false
	}))
	.use(session({
		secret: 'your secret',
		name: 'name of session id',
		resave: true,
		saveUninitialized: true }))
	.use(passport.initialize())
	.use(passport.session())
	.use(express.static(__dirname + '/../../public'));

if (process.env.VPS == 'true') { // Running on vps, require a login
	// Ensure user is authenticated and an admin. Use it side wide
	app.use((req, res, next) => {
		if (req.originalUrl.startsWith('/auth/steam')) { // Trying to log in, continue
			return next();
		}
		if (req.user) { // Is logged in
			if (process.env.ADMINS.indexOf(req.user.id) > -1) { // Is an admin, continue
				return next();
			}
			res.status(401);
			return res.render('no', { user: req.user });
		}
		res.redirect('/auth/steam');
	});
}

app
	.use('/', index)
	.use('/removeItems', removeItems)
	.use('/clearPricelist', clearPricelist)
	.use('/addItem', addItem)
	.use('/addItems', addItems)
	.use('/trades', trades)
	.use('/changeItem', changeItem)
	.use('/search', search)
	.use('/getItems', getItems)
	.use('/profit', profit)
	.use('/autoprice', autoprice)
	.use('/auth', authRoutes);
	
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

export = app;
