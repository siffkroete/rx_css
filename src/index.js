import { startPong } from './pong';
import { NetService, MSG } from './net_service';


const netService = NetService.getInstance('ws://localhost:8888', 'binary');


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
                    let _val = {};
                    if(typeof(val) === 'string') {
                        console.log('Nachricht vom Server ist vom Typ string');
                        try {
                            _val = JSON.parse(val);
                        } catch(e) {
                            console.log('Nachricht vom Server ist nicht vom Typ json.');
                            console.log('Nachricht wird ohne Parsen übernommen');
                            _val = val;
                        }
                    } else {
                        _val = val;
                    }
                    
                    console.log('Von Server val:  ', _val);
                    right_info.value = _val.payload.text;
                }
            },
            error => console.log('Fehler: ', error),
            () => console.log('Fertig')
        );
        console.log('wss subscribed!!!');
    });

    let myUsername = '';

    sendMsgButton.addEventListener('click', function(ev) {

        const msgType = 'utf8';
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
        
        netService.sendMsg(msg, msgType);

    });

    disconnectButton.addEventListener('click', function(ev) {
        wsSubscription.unsubscribe();
    });
})();
