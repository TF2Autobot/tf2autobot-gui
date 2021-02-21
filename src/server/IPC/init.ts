import ipc from 'node-ipc';
import * as handlers from './messageHandlers';

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id = 'Autobot-gui';
ipc.config.retry= 1500;

let botSockets = {};

ipc.serve(
    function(){
        setInterval(()=>{
            Object.keys(botSockets).forEach((a)=>{
                ipc.server.emit(
                    botSockets[a],
                    'getPricelist'
                );
            });
        }, 1000);

        ipc.server.on(
            'IAM',
            (data, socket)=>{
                if(!botSockets[data]){
                    socket.id = data;
                    botSockets[data] = socket;
                }
            }
        );

        ipc.server.on(
            'pricelist',
            (data)=>{
                console.log(JSON.stringify(data));
                console.log(data.a)
            }
        );
        ipc.server.on(
            'connect',
            (socket)=>{
                ipc.server.emit(
                    socket,
                    'WHOIS'
                );
            }
        );
        ipc.server.on(
            'socket.disconnected',
            (socket)=>{
                delete botSockets[socket.id];
            }
        )
    }
);




ipc.server.start();
