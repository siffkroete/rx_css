import { animationFrameScheduler as animScheduler, BehaviorSubject, Observable, of, fromEvent, merge, timer, defer, interval } from 'rxjs';
import { buffer, bufferCount, expand, filter, map, switchMap, takeUntil, takeWhile, 
    share, tap, withLatestFrom, take, timestamp, repeat, scan, reduce } from 'rxjs/operators';
import styledash from "./styledash.js";
import "./css/index.css";

import { boundaryDetection, collisionDetectionArr } from './game-util.js';


(function start(input) {
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');

    const boundaries = {
        left: 0,
        top: 0,
        bottom: 300,
        right: 400
    };
    const gameArea = document.getElementById('game');
    const infoDiv = document.getElementById('info');

    let gameRun = false;

    const obj_id = {
        'NO_OBJ': 0,
        'BALL': 1,
        'P_L': 2,
        'P_R': 3
    }

    function ObjToMove(width, height, x,y, vx, vy, _id) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.left = x;
        this.top = y;
        this.right = x + width;
        this.bottom = y + height;
        
        this.velocity = {
            x: vx,
            y: vy
        },
        this.id = _id
    }

    /**
     * Hier ist die ganze Game-Logik!!!
     * This is our core game loop logic. We update our objects and gameState here
     * each frame. The deltaTime passed in is in seconds, we are givent our current state,
     * and any inputStates. Returns the updated Game State
    **/
   let z = 0;
    const update = (deltaTime, state, inputState) => {
        if(gameRun) {
            z++;
            if((z%100) == 0) console.log('inputState: ', inputState);
            // console.log('within update: ---------------');
            // console.log('deltaTime: ', deltaTime);
            // console.log('state: : ', state);
            // console.log('inputState: : ', inputState);
            // console.log('End within update: -----------');

            if(state && state['objects'] !== undefined && state['objects'].length > 0) {
              
                state['objects'].forEach((obj) => {
                    // if((z%100) == 0) console.log('obj: ', obj);
                    // console.log('obj.id = obj.BALL: ' + 'obj.id: ' + obj.id + 'obj.BALL: ' + obj.BALL)
                    if(obj.id === obj_id.BALL) {

                        obj.x = obj.x += obj.velocity.x*deltaTime;
                        obj.y = obj.y += obj.velocity.y*deltaTime;

                        // Check if we exceeded our boundaries or paddle_left or paddle_right
                        // if((z%100) == 0) console.log('bla: ', [boundaries, ...state['objects'].slice(1)]);

                        // Grenz-Kollision
                        const didHitBound = boundaryDetection(obj, boundaries);
                        if(didHitBound) {
                            if(didHitBound === 'right' || didHitBound === 'left') {
                                obj.velocity.x *= -1;
                            } else {
                                obj.velocity.y *= -1;
                            }
                        }

                        // Paddle-Kollision
                        const didHit = collisionDetectionArr(obj, state['objects'].slice(1));
                        if(didHit) {
                            if(didHit === 'right' || didHit === 'left') {
                                obj.velocity.x *= -1;
                            } else {
                                obj.velocity.y *= -1;
                            }
                        }
                    } else if(obj.id === obj_id.P_L) {
                        if(inputState && inputState.to.type === 'keydown') {
                            let bewegungsRichtung = 0;
                            if(inputState.to.name === 'ArrowDown') { bewegungsRichtung = 1;}
                            else if(inputState.to.name === 'ArrowUp') { bewegungsRichtung = -1;}
                          
                            obj.y = obj.y += bewegungsRichtung * (obj.velocity.y*deltaTime);
                        }
                    } else if(obj.id === obj_id.P_R) {
                        // obj.x = obj.x += obj.velocity.x*deltaTime;
                        // obj.y = obj.y += obj.velocity.y*deltaTime;
                    }
                    
                });
            }
        } 
        return state;
    }

    /**
     * Zeichnet die Szene anhand dem neusten Game-State. Der Game-State ändert sich laufend
     * so wie in der Funktionsprogrammierung üblich: neuer Status ersetzt den alten ohne ihn zu ändern.
     * Das Ändern des Status wird aber anderswo gemacht
     */
    const ctx = gameArea.getContext('2d');
    const render = (state) => {
        if(gameRun) {
             // Wenn kein state dann gibts auch nichts zum Rendern.
            if(!state || !state['objects']) return;

            // Clear the canvas
            ctx.clearRect(0, 0, gameArea.clientWidth, gameArea.clientHeight);
        
            // Render all of our objects (simple rectangles for simplicity)
            state['objects'].forEach((obj) => {
                ctx.fillStyle = obj.color;
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            });
        }
    };

    const timer$ = timer(19000);

    // Stream von Events (hier Zahlen) die mit jedem Animation Frame des Browsers ausgesendet 
    // werden. share() wird verwendet damit sich subscriber bei Frame einschreiben können ohne das 
    // Seiteeffekte wiederholt werden.
    const _frame$ = of(0, animScheduler).pipe(repeat());
    const frame$ = _frame$.pipe( 
        
            takeUntil(timer$),  // Nur für Debug zeitlich begrenzen
            timestamp(),
            share()
        
    );

    const keydown$ = fromEvent(document, 'keydown').pipe(
        map( (keyEvent) => {
            if(keyEvent.code === 'Space') gameRun = !gameRun;
            // console.log('keyEvent: ', keyEvent);
            return {
                keyCode: keyEvent.keyCode,
                name: keyEvent.code,
                type: keyEvent.type,
                timeStamp: keyEvent.timeStamp
            }
        })
    );

    const keyup$ = fromEvent(document, 'keyup').pipe(
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
    
    const velocity = 80;
    const ball = new ObjToMove(15, 15, 100, 180, velocity, velocity, obj_id.BALL);
    const paddle_left = new ObjToMove(10, 50, boundaries.left + 20, boundaries.top + 20,
        velocity, velocity, obj_id.P_L);
    const paddle_right = new ObjToMove(10, 50, boundaries.right - 30, boundaries.top + 200,
        velocity, velocity, obj_id.P_R);

    const initialState = {
        gameRun: false,
        obj_count: 1,
        objects: [ball, paddle_left, paddle_right]
    }

    const gameState$ = new BehaviorSubject(initialState);

    // Game-Loop çççççççççççççççççççççççççççççççççççççççççççççççççç
    // Das ist die eigentliche gameLoop!!!
    let lastTimeStamp = Date.now();
    
    frame$.pipe(
        withLatestFrom(keyChangeEvent$, gameState$),
        map( ([_intervallNr, _keyChangeEvent, _gameState]) => {
            const _now = _intervallNr.timestamp;
            const deltaTime =  _now - lastTimeStamp;
            lastTimeStamp = _now;
            // Hier wird der neue Status anhand des alten und anhand des _keyChangeEvent berechnet.
            // KeyChangeEvent ist der Status der Knöpfe die gedrückt wurden in diesem Frame oder kurz davor.
            return update(deltaTime/1000, _gameState, _keyChangeEvent);
        }),
        tap((game_state) => gameState$.next(game_state))
    ).subscribe((_game_state) => {
        render(_game_state);
    });
    
    // startButton.addEventListener('click', (ev) => {
    //     frame$
    // });

    // stopButton.addEventListener('click', (ev) => {
    //     frame$.unsubscribe();
    // });

    
    // End Game-Loop çççççççççççççççççççççççççççççççççççççççççççççç
})();
