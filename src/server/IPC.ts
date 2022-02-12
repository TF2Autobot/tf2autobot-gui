//import { IPC } from 'node-ipc';
import {Pricelist, PricelistItem} from "../common/types/pricelist";

const {IPCModule} = require('node-ipc');

export default class BotConnectionManager {
    bots: { [id: string]: { socket: any, pricelistTS?: number, pricelist?: Pricelist, admins?: string[], id: string } };

    private initiated: boolean;

    private ipc: typeof IPCModule;

    constructor() {
        this.ipc = new IPCModule;
        this.bots = {};
        this.initiated = false;
    }

    private getPricelist(socket, callback?) {
        this.ipc.server.emit(
            socket,
            'getPricelist'
        );
        if(callback){
            this.ipc.server.once('pricelist', callback);
        }
    }
    private getInfo(socket, callback?) {
        this.ipc.server.emit(
            socket,
            'getInfo'
        );
        if(callback){
            this.ipc.server.once('info', callback);
        }
    }

    static cleanItem(item){
        return {
            sku: item.sku,
            enabled: item.enabled,
            autoprice: item.autoprice,
            min: item.min,
            max: item.max,
            intent: parseInt(item?.intent),
            buy: { keys: item.buy?.keys, metal: item.buy?.metal },
            sell: { keys: item.sell?.keys, metal: item.sell?.metal },
            promoted: item.promoted,
            group: item.group,
            note: { buy: item.note.buy, sell: item.note.sell },
            isPartialPriced: item.isPartialPriced
        }
    }

    getBotPricelist(id: string) {
        return new Promise<undefined | Pricelist>((resolve, reject)=>{
            if(!this.bots[id]) reject("no bot found");
            else if(this.bots[id].pricelistTS > Date.now() - 15*1000) {
                resolve(this.bots[id].pricelist);
            } else {
                this.getPricelist(this.bots[id].socket, (data)=>{
                    resolve(data);
                });
            }
        });
    }
    addItem(id: string, item: object) {
        return new Promise<undefined | PricelistItem>((resolve, reject)=>{
            if(!this.bots[id]) reject("no bot found");
            else {
                this.ipc.server.emit(
                    this.bots[id].socket,
                    'addItem',
                    BotConnectionManager.cleanItem(item)
                );
                this.ipc.server.once('itemAdded', resolve);
            }
        });
    }
    updateItem(id: string, item: object) {
        return new Promise<undefined | PricelistItem>((resolve, reject)=>{
            if(!this.bots[id]) reject("no bot found");
            else {
                this.ipc.server.emit(
                    this.bots[id].socket,
                    'updateItem',
                    BotConnectionManager.cleanItem(item)
                );
                this.ipc.server.once('itemUpdated', resolve);
            }
        });
    }
    removeItem(id: string, sku: string) {
        return new Promise<undefined | PricelistItem>((resolve, reject)=>{
            if(!this.bots[id]) reject("no bot found");
            else {
                this.ipc.server.emit(
                    this.bots[id].socket,
                    'removeItem',
                    sku
                );
                this.ipc.server.once('itemRemoved', resolve);
            }
        });
    }

    getTrades(id: string) {
        return new Promise<undefined | PricelistItem>((resolve, reject)=>{
            if(!this.bots[id]) reject("no bot found");
            else {
                this.ipc.server.emit(
                    this.bots[id].socket,
                    'getTrades'
                );
                this.ipc.server.once('polldata', resolve); //TODO: cache
            }
        });
    }

    init() {
        this.ipc.config.id = 'autobot_gui_dev';
        this.ipc.config.retry = 1500;
        this.ipc.config.logger = console.debug;
        this.ipc.config.silent = process.env.NODE_ENV === 'production';
        this.ipc.serve(() => {
            this.initiated = true;
            this.ipc.server.on(
                'info',
                (data, socket) => {
                    if (!this.bots[data.id]) {
                        console.log('bot id ' + data.id);
                        socket.id = data.id;
                        this.bots[data.id] = {socket, ...data};
                    }
                }
            );
            this.ipc.server.on(
                'pricelist',
                (data, socket) => {
                    if(!data) {
                        setTimeout(() => this.getPricelist(socket), 3000);
                    } else {
                        console.log('NEW PRICELiST');
                        console.log(data);
                        this.bots[socket.id]['pricelist'] = data;
                        this.bots[socket.id]["pricelistTS"] = Date.now();
                    }
                }
            );
            this.ipc.server.on(
                'connect',
                (socket) => {
                    this.getInfo(socket);
                }
            );
            this.ipc.server.on(
                'socket.disconnected',
                (socket) => {
                    delete this.bots[socket.id];
                }
            )
        });
        this.ipc.server.start();
    }
}
