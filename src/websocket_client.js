
import { Subject, throwError, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';


export const websocket_client = (function() {

    const closeSubject = new Subject();
    closeSubject.subscribe(_ => console.log('Verbindung eschlossen.'));

    return {
        getWebsocketSubject: function(_url, type) {
            const url = _url;
            let wsSubject = {};

            if(type === 'binary' || type === 'arraybuffer' || type === 'ArrayBuffer') {
                wsSubject = webSocket({
                    binaryType: 'arraybuffer',
                    url: _url,
                    serializer: v => v, // Weil sonst automatisch JSON.parse bzw. JSON.stringify
                    deserializer: v => v.data, // Weil sonst automatisch JSON.parse bzw. JSON.stringify
                    closeObserver: closeSubject,
                    openObserver: {
                        next: () => console.log('Verbindung offen.')
                    }
                });
            } else if(type === 'utf8' || type === 'text') {
                wsSubject = webSocket({
                    url: _url,
                    closeObserver: closeSubject,
                    openObserver: {
                        next: () => console.log('Verbindung offen.')
                    }
                });
            }
            return wsSubject;
        }
    }
})();
