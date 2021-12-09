//import { IPC } from 'node-ipc';
import {Pricelist} from "../common/types/pricelist";

const {IPCModule} = require('node-ipc');

export default class BotConnectionManager {
    private bots: { [id: string]: { socket: any, pricelist?: Pricelist, admins?: string[] } };

    private initiated: boolean;

    private ipc: typeof IPCModule;

    constructor() {
        this.ipc = new IPCModule;
        this.bots = {};
        this.initiated = false;
    }
    getPricelist(socket) {
        this.ipc.server.emit(
            socket,
            'getPricelist'
        );
    }
    getInfo(socket) {
        this.ipc.server.emit(
            socket,
            'getInfo'
        );
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
                        this.bots[data.id] = {socket};
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
