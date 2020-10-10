import { retryWhen, delay, tap } from 'rxjs/operators';
import { websocket_client } from './websocket_client';

export const MSG = { 
    START_GAME: 'START_GAME', // Anfrage nach Game-Start
    GAME_STARTED: 'GAME_STARTED', // Antwort vom Gegner, jetzt gehts erst los
    GAME_CONTROL_MSG : 'GAME_CONTROL_MSG',
    CHAT_MSG : 'CHAT_MSG',
    CONN_INDEX_ERR: -1
};

export var NetService = (function() {
    function NetService(url, type) {
        const websocketSubject = websocket_client.getWebsocketSubject(url, type);

        this.wsObserver = websocketSubject;
        this.wsObservable = websocketSubject.pipe(
            tap(val => console.log('tap val: ', val)),
            // catchError(val => of(val)),
            retryWhen(
                errors => {
                    return errors.pipe(
                        tap(err => console.log('err: ', err)),
                        delay(10000)
                    )
                }
            )
        );
    }

    NetService.prototype.sendMsg = function(_msg, type = 'binary') {
        let msg = '';
        if(type === 'utf8' || type === 'text') {
            msg = JSON.stringify(_msg);
        } else if(type === 'binary' || type === 'arraybuffer' || type === 'ArrayBuffer') {
            msg = _msg;
        }
        
        this.wsObserver.next(msg);
    }

    NetService.prototype.subscribe = function(next, err, complete) {
        return this.wsObservable.subscribe(next, err, complete);
    }

    let instance = null;

    NetService.getInstance = function(url, type) {
        if(!instance) instance = new NetService(url, type);
        return instance;
    }
    
    return NetService;
})();
