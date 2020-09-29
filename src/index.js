import { startPong } from './pong';
import { NetService, MSG } from './net_service';


const netService = NetService.getInstance('ws://localhost:8888', 'utf8');


(function() {
    const left_info = document.getElementById('left_info');
    const right_info = document.getElementById('right_info');
    left_info.value = 'Siffkroete';
    const connectButton = document.getElementById('connect');
    const sendMsgButton = document.getElementById('send_msg');
    const disconnectButton = document.getElementById('disconnect');

    startPong(netService);

    let wsSubscription = null;

    connectButton.addEventListener('click', function(ev) {
        wsSubscription = netService.subscribe(
            (val) => {
                if(val instanceof ArrayBuffer) {
                    console.log('Daten vom Server sind vom Typ "ArrayBuffer". val: ', val);
                } else {
                    console.log('Von Server: ', val.payload.text);
                    right_info.value = val.payload.text;
                }
            },
            error => console.log('Fehler: ', error),
            () => console.log('Fertig')
        );
        console.log('wss subscribed!!!');
    });

    let myUsername = '';

    sendMsgButton.addEventListener('click', function(ev) {
        let text = left_info.value;
        if(myUsername === '') myUsername = text;
        const msg = {
            type: MSG.CHAT_MSG,
            payload: {
                from: myUsername,
                text: text
            }
        }
        // let buffer = new ArrayBuffer(16);
        // let msg = new Uint32Array(buffer); 
        netService.sendMsg(msg);
    });

    disconnectButton.addEventListener('click', function(ev) {
        wsSubscription.unsubscribe();
    });
})();
