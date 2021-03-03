import { IPC } from 'node-ipc';

export default class BotConnectionManager extends IPC {
    private botSockets: Map<string, any>;

    constructor() {
        super();
        this.botSockets = new Map();
    }

    init() {
        this.config.id = 'autobot_gui_dev';
        this.config.retry= 1500;
        this.serve(()=>{
            this.server.on(
                'info',
                (data, socket)=>{
                    if(!this.botSockets.has(data.id)){
                        console.log('bot id ' + data.id);
                        socket.id = data.id;
                        this.botSockets.set(data, socket);
                    }
                }
            );
            this.server.on(
                'connect',
                (socket)=>{
                    this.server.emit(
                        socket,
                        'getInfo'
                    );
                }
            );
            this.server.on(
                'socket.disconnected',
                (socket)=>{
                    // @ts-ignore
                    this.botSockets.delete(socket.id);
                }
            )
        });
        this.server.start();
    }
}
