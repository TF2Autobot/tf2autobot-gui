export type Pricelist = PricelistItem[]

export interface PricelistItem {
    sku: string
    name?: string;
    max: number;
    min: number;
    buy: Price;
    sell: Price;
    style?: {
        image_small: string;
        effect: string;
        quality_color: string;
        craftable: boolean;
        border_color: string;
        killstreak: string;
    };
    "promoted": 0,
    "group": "all",
    "note": {
        "buy": null,
        "sell": null
    },
    enabled: boolean;
    intent: number;
    autoprice: boolean;
    time: number;
    statslink?: string;
}

interface Price {
    keys: number;
    metal: number;
    string?: string;
    total?: number;
}