import getName from '../utils/getName';
import * as data from '../data';
import dayjs from 'dayjs';
import SKU from '@tf2autobot/tf2-sku';
import * as getImage from '../utils/getImage';
import * as profit from './profit';
import SchemaManager from "@tf2autobot/tf2-schema";

/**
 *
 * @param {Number} first index of first trade to be included in results
 * @param {Number} count how many trades to include in results, set to -1 to return all
 * @param {Boolean} descending sort
 * @param {String} search string to search listings for
 * @param {Boolean} acceptedOnly
 * @param schema
 * @param polldata
 */
export async function get(first: number, count: number, descending: boolean, search: string, acceptedOnly: boolean, schema: SchemaManager.Schema, polldata: any) {
    search = search.trim().toLowerCase();
    const profitData = (await profit.get(undefined, undefined, undefined, polldata, true)).tradeProfits;
    let tradeList = Object.keys(polldata?.offerData || {}).map((key) => {
        const ret = polldata.offerData[key];
        ret.id = key;
        return ret;
    });
    tradeList = tradeList.sort((a, b) => {
        a = a.finishTimestamp;
        b = b.finishTimestamp;

        // check for undefined time, sort those at the end
        if ( (!a || isNaN(a)) && !(!b || isNaN(b))) {return 1;}
        if ( !(!a || isNaN(a)) && (!b || isNaN(b))) {return -1;}
        if ( (!a || isNaN(a)) && (!b || isNaN(b))) {return 0;}

        if (descending) {
            b = [a, a = b][0];
        }

        return a - b;
    });
    tradeList = tradeList.filter((offer) => {
        if(!search) {return (offer.isAccepted || !acceptedOnly);}
        let offerSearchResults = false;
        if (Object.prototype.hasOwnProperty.call(offer, 'dict')) {
            offerSearchResults = [].concat(Object.keys(offer.dict.our), Object.keys(offer.dict.their)).some(item => {
                return getName(SKU.fromString(item), schema).toLowerCase().indexOf(search) > -1;
            });
        }
        return (offer.partner?.indexOf(search) > -1 || offerSearchResults) && (offer.isAccepted || !acceptedOnly);
    });
    const tradeCount = tradeList.length;
    tradeList = tradeList.slice(first, count >= 0 ? first + count : undefined);
    const items = {};
    const trades = tradeList.map((offer) => {
        const ret = {
            id: offer.id,
            items: {
                our: [],
                their: []
            },
            profit: Object.prototype.hasOwnProperty.call(profitData, offer.id)?profitData[offer.id]: '',
            partner: offer.partner,
            accepted: offer.accepted || ( offer.handledByUs === true && offer.isAccepted === true),
            time: offer.finishTimestamp,
            datetime: dayjs.unix(Math.floor(offer.finishTimestamp/1000)).format('ddd D-M-YYYY HH:mm'),
            value: offer.value
        };

        if (typeof polldata.sent[offer.id] != 'undefined') {
            ret['lastState'] = data.ETradeOfferState[polldata.sent[offer.id]];
        } else if (typeof polldata.received[offer.id] != 'undefined') {
            ret['lastState'] = data.ETradeOfferState[polldata.received[offer.id]];
        }

        if (Object.prototype.hasOwnProperty.call(offer, 'dict')) {
            if (Object.keys(offer.dict.our).length > 0) {
                tradeSide('our');
            }
            if (Object.keys(offer.dict.their).length > 0) {
                tradeSide('their');
            }
        }

        return ret;

        /**
		 * Get items from one side of a trade
		 * @param {'our'|'their'} side
		 */
        function tradeSide(side) {
            Object.keys(offer.dict[side]).forEach((k) => {
                if (!Object.prototype.hasOwnProperty.call(items, k)) {
                    items[k] = createTradeItem(k, schema);
                }
                ret.items[side].push({
                    sku: k,
                    amount: offer.dict[side][k]
                });
            });
        }
    });
    return {
        trades,
        items,
        tradeCount
    };
};

/**
 * Creates item object
 * @param {String} sku
 * @param schema
 * @return {Object} item object created
 */
function createTradeItem(sku, schema: SchemaManager.Schema) {
    return {
        name: getName(sku, schema),
        style: getImage.getImageStyle(sku, schema)
    };
}
