import { animationFrameScheduler as animScheduler, Subject, BehaviorSubject, Observable,
    of, fromEvent, merge, timer, defer, interval } from 'rxjs';
import { buffer, bufferCount, expand, filter, map, switchMap, takeUntil, takeWhile, 
    share, tap, withLatestFrom, take, timestamp, repeat,
    scan, reduce, startWith } from 'rxjs/operators';
import "./css/index.css";
import "./css/pong_mit_canvas.css";
// import { boundaryDetection, collisionDetectionArr, getRandomInt } from './game-util.js';
import { Render } from './render_mit_canvas';
import { GameModel } from './gameModel';



export const startPong = function (netService$) {
    
    const gameArea = document.getElementById('game');
    const renderObj = Render(gameArea);

    // const timer$ = timer(120000);
    const startStop$ = new Subject();

    // Stream von Events (hier Zahlen) die mit jedem Animation Frame des Browsers ausgesendet 
    // werden. share() wird verwendet damit sich subscriber bei Frame einschreiben können ohne das 
    // Seiteeffekte wiederholt werden.
    const frame$ = defer(() => of(0, animScheduler)).pipe(
        repeat(),
        takeUntil(startStop$),  // Nur für Debug zeitlich begrenzen
        timestamp(),
        share()
    );

    const keydown$ = fromEvent(document, 'keydown').pipe(
        map( (keyEvent) => {
            // if(keyEvent.code === 'Space') gameRun = !gameRun;
            // console.log('keyEvent: ', keyEvent);
            return {
                keyCode: keyEvent.keyCode,
                name: keyEvent.code,
                type: keyEvent.type,
                timeStamp: keyEvent.timeStamp
            }
        })
    );

    let initialKeyState = {
        keyCode: 32,
        code: 'Space',
        type: 'keyup ',
        timeStamp: Date.now()
    };

    const keyup$ = fromEvent(document, 'keyup').pipe(
        startWith(initialKeyState),
        map( (keyEvent) => {
            // console.log('keyEvent: ', keyEvent);
            return {
                keyCode: keyEvent.keyCode,
                name: keyEvent.code,
                type: keyEvent.type,
                timeStamp: keyEvent.timeStamp
            }
        })
    );
   
    const keyChangeEvent$ = merge(keydown$, keyup$).pipe(
        buffer(frame$),
        filter(keyStates => keyStates.length),
        map( (keyStates) => {
            let keyChangeObj = {from: '', to: ''};
            switch(keyStates.length) {
                case 1:
                    keyChangeObj = {from: '',
                                     to: keyStates[keyStates.length - 1]};
                break;
                default:
                    keyChangeObj = {from: keyStates[keyStates.length - 2],
                                     to: keyStates[keyStates.length - 1]};
            }
            // console.log('keyChangeObj: ', keyChangeObj);
            return keyChangeObj;
        })
    );

    let gameModel = GameModel.getInstance();
    
    const gameState$ = new BehaviorSubject(gameModel.getInitialState());

    let lastTimeStamp = Date.now();

   
    
    // Game-Loop çççççççççççççççççççççççççççççççççççççççççççççççççç
    const finalStream$ = defer(() => frame$.pipe(
        withLatestFrom(keyChangeEvent$, gameState$, netService$.wsObservable),
        map( ([_intervallNr, _keyChangeEvent, _gameState, _inputState]) => {
            console.log('New Frame---!!!')
            const _now = _intervallNr.timestamp;
            const deltaTime =  _now - lastTimeStamp;
            lastTimeStamp = _now;
            // Hier wird der neue Status anhand des alten und anhand des _keyChangeEvent berechnet.
            // KeyChangeEvent ist der Status der Knöpfe die gedrückt wurden in diesem 
            // Frame oder kurz davor.
            const newGameState = gameModel.updateState(deltaTime/1000, _gameState, _inputState);

            netService$.sendMsg(_keyChangeEvent); // Daten an Server schicken

            // Neuen Game-State zurückgeben damit er oben wieder dazu kommt werden bei withLatestFrom...
            return newGameState; 
        }),
        tap((game_state) => gameState$.next(game_state))
    ));
    // End Game-Loop çççççççççççççççççççççççççççççççççççççççççççççç


    let subscriber = null;

    const startButton = document.getElementById('start_button');
    startButton.addEventListener('click', function(ev) {
        if(startButton.innerHTML === 'Start') {
            gameModel.gameRun = true;
            lastTimeStamp = Date.now();
            subscriber = finalStream$.subscribe((_game_state) => {
                renderObj.render(_game_state);
            });
            startButton.innerHTML = 'Stop';
        } else if(startButton.innerHTML === 'Stop') {
            // subscriber.unsubscribe();
            gameModel.gameRun = false;
            startStop$.next(1);
            startButton.innerHTML = 'Start';
        } else {
            console.log('Fehler! startButton.innerHTML muss Start oder Stop sein!');
        }
    });
}
