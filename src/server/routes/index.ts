import express, {Router} from 'express';
import removeItems from "../routesOld/removeItems";
import clearPricelist from "../routesOld/clearPricelist";
import addItem from "./addItem";
import trades from "./trades";
import changeItem from "../routesOld/changeItem";
import getItems from "./getItems";
import profit from "../routesOld/profit";
import autoprice from "../routesOld/autoprice";
import authRoutes from "./auth";
import addItems from './addItems';
import search from './search';
import bot from './bot';
import SchemaManager from "@tf2autobot/tf2-schema";
import BotConnectionManager from "../IPC";

export = function init(schemaManager: SchemaManager, botManager: BotConnectionManager) : Router {
	const router = express.Router();
	router
		.get('/', (req, res) => {
			res.render('index', { user: req.user });
		})
		.use('/removeItems', removeItems)
		.use('/clearPricelist', clearPricelist)
		.use('/addItem', addItem(schemaManager))
		.use('/addItems', addItems(schemaManager))
		.use('/trades', trades(schemaManager))
		.use('/changeItem', changeItem)
		.use('/search', search(schemaManager))
		.use('/getItems', getItems(schemaManager))
		.use('/profit', profit(schemaManager))
		.use('/autoprice', autoprice)
		.use('/auth', authRoutes)
		.use(bot(schemaManager, botManager));
	return router;
}
