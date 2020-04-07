const fs = require('fs-extra');
const paths = require('../resources/paths');
const Currency = require('tf2-currencies');
const axios = require('axios');

// TODO: Make this into class
/**
 * @param {Boolean} toKeys convert to keys if true
 * @param {Number} start time to start plot
 * @param {Number} interval time interval to plot
 * @param {Number} end time to end plot
 * @return {Object}
 */
exports.get = async function get(toKeys, start, interval, end) {
	const polldata = await fs.readJSON(paths.files.polldata);
	const response = await axios(
		{
			url: 'https://api.prices.tf/items/5021;6',
			method: 'GET',
			params: {
				src: 'bptf'
			},
			json: true
		}
	);
	const keyVal = response.data.sell.metal;
	const trades = Object.keys(polldata.offerData).map((key)=>{
		const ret = polldata.offerData[key];
		ret.time = polldata.timestamps[key];
		ret.id = key;
		return ret;
	});
	const itemStock = {};
	let overpriceProfit = 0;
	const overItems = {}; // items sold before being bought

	const tracker = new itemTracker(toKeys, start, interval, end);

	trades.sort((a, b)=>{
		return a.time - b.time;
	});

	let iter = 0; // to keep track of how many trades are accepted
	for (let i = 0; i < trades.length; i++) { // TODO: ADMIN TRADES
		const trade = trades[i];
		if (!(trade.handledByUs === true && trade.isAccepted === true)) {
			continue;// trade was not accepted, go to next trade
		}
		iter++;
		let isGift = false;
		if (!Object.prototype.hasOwnProperty.call(trade, 'dict')) {
			continue;// trade has no items ?
		}
		if (typeof Object.keys(trade.dict.our).length == 'undefined') {
			isGift = true;// no items on our side, so it is probably gift
		} else if (Object.keys(trade.dict.our).length != 0) { // trade is not a gift
			if (!Object.prototype.hasOwnProperty.call(trade, 'value')) {
				continue; // trade is missing value object
			}
			if (!(Object.keys(trade.prices).length > 0)) {
				continue; // have no prices, broken, skip
			}
		} else {
			isGift = true; // no items on our side, so it is probably gift
		}
		if (typeof trade.value === 'undefined') {
			trade.value = {};
		}
		if (typeof trade.value.rate === 'undefined') {
			if (!Object.prototype.hasOwnProperty.call(trade, 'value')) trade.value = {}; // in case it was gift
			trade.value.rate = keyVal;// set key value to current value if it is not defined
		}
		for (sku in trade.dict.their) { // items bought
			if (Object.prototype.hasOwnProperty.call(trade.dict.their, sku)) {
				const itemCount = trade.dict.their[sku];

				if (sku !== '5000;6' && sku !== '5002;6' && sku !== '5001;6' && sku !== '5021;6') { // if it is not currency
					if (isGift) {
						if (!Object.prototype.hasOwnProperty.call(trade, 'prices')) trade.prices = {};
						trade.prices[sku] = { // set price to 0 because it's a gift
							buy: {
								metal: 0,
								keys: 0
							}
						};
					} else if (!Object.prototype.hasOwnProperty.call(trade.prices, sku)) {
						continue; // item is not in pricelist, so we will just skip it
					}
					const prices = trade.prices[sku].buy;

					tracker.boughtItem(itemCount, sku, prices, trade.value.rate, trade.time);
				}
			}
		}

		for (sku in trade.dict.our) {
			if (Object.prototype.hasOwnProperty.call(trade.dict.our, sku)) {
				const itemCount = trade.dict.our[sku];
				if (sku !== '5000;6' && sku !== '5002;6' && sku !== '5001;6' && sku !== '5021;6') { // TODO: TEST KEY TRADING BOTS
					if (!Object.prototype.hasOwnProperty.call(trade.prices, sku)) {
						continue; // item is not in pricelist, so we will just skip it
					}
					const prices = trade.prices[sku].sell;
					tracker.soldItem(itemCount, sku, prices, trade.value.rate, trade.time);
				}
			}
		}
		if (!isGift) { // calculate overprice profit
			overpriceProfit += tracker.convert(trade.value.their, trade.value.rate) - tracker.convert(trade.value.our, trade.value.rate);
			tracker.profitTrack.countProfit( tracker.convert(trade.value.their, trade.value.rate) - tracker.convert(trade.value.our, trade.value.rate), trade.time);
		}
	}
	// TODO: put into return object
	console.log(iter);
	console.log(itemStock);
	console.log(tracker.itemStock);
	console.log(overItems);
	console.log(tracker.overItems);
	console.log(`Profit from overprice: ${overpriceProfit} ${toKeys?'keys':'scrap'}.`);
	console.log(`Total profit: ${tracker.profitTrack.profit} ${toKeys?'keys':'scrap'}.`);
	console.log(tracker.profitTrack.profitPlot);
	console.log(tracker.profitTrack.profitTimed);
	return {
		profitTotal: tracker.profitTrack.profit,
		profitTimed: tracker.profitTrack.profitTimed,
		profitPlot: tracker.profitTrack.profitPlot
	};
};

/**
 * class for tracking profit and storing profit data
 */
class profitTracker {
	/**
	 * 
	 * @param {Number} start 
	 * @param {Number} interval 
	 * @param {Number} end 
	 */
	constructor(start, interval, end) {
		this.start = Number(typeof start != 'undefined' ? start : -1);
		this.interval = Number(typeof interval != 'undefined' ? interval : -1);
		this.end = Number(typeof end != 'undefined' ? end : Math.floor(Date.now()/1000));
		this.lastTradeTime = -1;
		
		this.tempProfit = 0;

		this.profit = 0;
		this.profitPlot = [];
		this.profitTimed = 0;
	}

	/**
	 * 
	 * @param {Number} normalizedAmount amount of profit made normalized to keys or scrap
	 * @param {Number} time trade time 
	 */
	countProfit(normalizedAmount, time) {
		this.profit += normalizedAmount;
		if (time >= this.start && time < this.end) { // is within time of interest
			this.profitTimed += normalizedAmount;
			if (this.interval > 0) { // not first trade being evaluated and we have plot interval
				const lastTradePlotBlock = Math.floor((this.lastTradeTime - this.start) / this.interval);
				const thisTradePlotBlock = Math.floor((time - this.start) / this.interval);
				if (lastTradePlotBlock != thisTradePlotBlock && this.lastTradeTime !== -1) { // last block is done so we will push it to plot
					this.profitPlot.push({time: lastTradePlotBlock*this.interval + this.start, profit: this.tempProfit});
					this.tempProfit = normalizedAmount; // reset temp to value of current trade
				} else {
					this.tempProfit += normalizedAmount;
				}
			}
			this.lastTradeTime = time;
		} else if (this.lastTradeTime < this.end && this.tempProfit !== 0 && this.interval > 0) { // push last trade block to plot if plot is being created
			const lastTradePlotBlock = Math.floor((this.lastTradeTime - this.start) / this.interval);
			this.profitPlot.push({time: lastTradePlotBlock*this.interval + this.start, profit: this.tempProfit});
			this.tempProfit = 0;
		}
	}
}
/**
 * this class tracks items in our inventory and their price
 */
class itemTracker {
	/**
	 * 
	 * @param {Boolean} toKeys 
	 * @param {Number} start 
	 * @param {Number} interval 
	 * @param {Number} end 
	 */
	constructor(toKeys, start, interval, end) {
		this.toKeys = toKeys;
		this.itemStock = {};
		this.overItems = {}; // items sold before being bought
		this.itemPricePlot = {};
		this.profitTrack = new profitTracker(start, interval, end);
	}

	/**
	 * 
	 * @param {Number} itemCount item to add
	 * @param {String} sku 
	 * @param {Object} prices prices for this item
	 * @param {Number} rate key rate
	 * @param {Number} time
	 */
	boughtItem(itemCount, sku, prices, rate, time) {
		if (Object.prototype.hasOwnProperty.call(this.overItems, sku)) { // if record for this item exists in overItems check it
			if (this.overItems[sku].count > 0) {
				if (this.overItems[sku].count >= itemCount) {
					this.overItems[sku].count -= itemCount;
					this.profitTrack.countProfit( (this.overItems[sku].price - this.convert(prices, trade.value.rate, toKeys)) * itemCount, time);
					return; // everything is already sold no need to add to stock
				} else {
					itemsOverOverItems = itemCount - overItems[sku].count;
					overItems[sku].count = 0;
					this.profitTrack.countProfit( (overItems[sku].price - this.convert(prices, trade.value.rate, toKeys)) * (itemCount - itemsOverOverItems), time);
					itemCount = itemsOverOverItems;
				}
			}
		}
		if (Object.prototype.hasOwnProperty.call(this.itemStock, sku)) { // check if record exists
			const priceAvg = this.itemStock[sku].price;
			const itemCountStock = this.itemStock[sku].count;
			this.itemStock[sku].price = ((priceAvg * itemCountStock) + (itemCount * this.convert(prices, rate))) / (itemCountStock + itemCount); // calculate new item average price
			this.itemStock[sku].count += itemCount;
		} else {
			this.itemStock[sku] = {
				count: itemCount,
				price: this.convert(prices, rate)
			};
		}
	}

	/**
	 * 
	 * @param {Number} itemCount number of items sold
	 * @param {String} sku 
	 * @param {Object} prices prices for item sold
	 * @param {Number} rate key rate
	 * @param {Number} time time of trade
	 */
	soldItem(itemCount, sku, prices, rate, time) {
		if (Object.prototype.hasOwnProperty.call(this.itemStock, sku)) { // have we bought this item already
			if (this.itemStock[sku].count >= itemCount) {
				this.itemStock[sku].count -= itemCount;
				this.profitTrack.countProfit( (this.convert(prices, rate) - this.itemStock[sku].price) * itemCount, time);
				return;
			} else {
				this.profitTrack.countProfit( (this.convert(prices, rate) - this.itemStock[sku].price) * this.itemStock[sku].count, time);
				itemCount -= this.itemStock[sku].count;
				this.itemStock[sku].count = 0;
			}
		}
		if (Object.prototype.hasOwnProperty.call(this.overItems, sku)) { // check if record exists
			const priceAvg = this.overItems[sku].price;
			const itemCountStock = this.overItems[sku].count;
			this.overItems[sku].price = ((priceAvg * itemCountStock) + (itemCount * this.convert(prices, rate))) / (itemCountStock + itemCount); // calculate new item average price
			this.overItems[sku].count += itemCount;
		} else {
			this.overItems[sku] = {
				count: itemCount,
				price: this.convert(prices, rate)
			};
		}
	}

	/**
	 * 
	 * @param {Object} prices {keys, metal} price to convert
	 * @param {Number} keyPrice 
	 * @return {Number} converted
	 */
	convert(prices, keyPrice) {
		if (this.toKeys) {
			const item = new Currency({
				metal: prices.metal,
				keys: prices.keys
			}).toValue(keyPrice);
			const key = new Currency({
				metal: keyPrice
			}).toValue(keyPrice);
			return item / key;
		} else {
			const converted = new Currency(prices).toValue(keyPrice);
			return converted;
		}
	}
}
