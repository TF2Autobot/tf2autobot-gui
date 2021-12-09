//import { IPC } from 'node-ipc';
const {IPCModule} = require('node-ipc');

export default class BotConnectionManager {
    private botSockets: Map<string, any>;

    private initiated: boolean;

    private ipc: typeof IPCModule;

    constructor() {
        this.ipc = new IPCModule;
        this.botSockets = new Map();
        this.initiated = false;
    }

    init() {
        this.ipc.config.id = 'autobot_gui_dev';
        this.ipc.config.retry= 1500;
        this.ipc.serve(()=>{
            this.initiated = true;
            this.ipc.server.on(
                'info',
                (data, socket)=>{
                    if(!this.botSockets.has(data.id)){
                        console.log('bot id ' + data.id);
                        socket.id = data.id;
                        this.botSockets.set(data, socket);
                    }
                }
            );
            this.ipc.server.on(
                'connect',
                (socket)=>{/*
                    this.server.emit(
                        socket,
                        'getInfo'
                    );*/
                }
            );
            this.ipc.server.on(
                'socket.disconnected',
                (socket)=>{
                    // @ts-ignore
                    this.botSockets.delete(socket.id);
                }
            )
        });
        this.ipc.server.start();
    }
}
