import {PricelistItem} from "../../../common/types/pricelist";
import {Response} from "express";

export function checkItem(item: PricelistItem, res: Response | undefined) {
    if (!item.autoprice) {
        // lower sell keys
        if (item.sell.keys < item.buy.keys && item.intent != 0) {
            res?.json('The sell price must be higher than the buy price');
            return true;
        }
        // Same amount of keys, lower or equal sell metal
        if (item.sell.keys === item.buy.keys && item.sell.metal <= item.buy.metal && item.intent != 0) {
            res?.json('The sell price must be higher than the buy price');
            return true;
        }
    } else { // Autopriced, so dont use values
        item.sell = {
            keys: 0,
            metal: 0
        };
        item.buy = {
            keys: 0,
            metal: 0
        };
    }
    return false;
}
