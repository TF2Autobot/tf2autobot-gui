import {PricelistItem} from "../../common/types/pricelist";
import SKU from "tf2-sku-2";
import getStatsLink from "./getStatsLink";
import Currency from "tf2-currencies-2";
import {getImageStyle} from "./getImage";
import {Schema} from "tf2-schema-2";

const keyPrice = 56; //TODO fetch from bot

export default function process(item: PricelistItem, schema: Schema): PricelistItem {
    if (!item.name) {
        item.name = schema.getName(SKU.fromString(item.sku));
    }
    item.statslink = getStatsLink(item.sku, schema);
    [item.buy, item.sell].forEach((prices)=>{
        const currency = new Currency({
            metal: prices.metal,
            keys: prices.keys
        })
        prices.total = currency.toValue(keyPrice);
        prices.string = currency.toString();
    });
    item.style = getImageStyle(item.sku, schema);
    return item;
}
