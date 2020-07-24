import { animationFrameScheduler as animScheduler, BehaviorSubject, Observable, of, fromEvent, merge, timer, defer, interval } from 'rxjs';
import { buffer, bufferCount, expand, filter, map, switchMap, takeUntil, takeWhile, 
    share, tap, withLatestFrom, take, timestamp, repeat, scan, reduce } from 'rxjs/operators';
import "./css/pong_mit_canvas.css";
import { boundaryDetection, collisionDetectionArr, getRandomInt } from './game-util.js';
import { Render } from './render_mit_canvas';


(function start(input) {

    const boundaries = {
        left: 0,
        top: 0,
        bottom: 300,
        right: 400
    };
    const gameArea = document.getElementById('game');
    const infoDiv = document.getElementById('info');
    const infoDivLeft = document.getElementById('left_info');
    const infoDivRight = document.getElementById('right_info');
    const renderObj = Render(gameArea);


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
            // if((z%100) == 0) console.log('inputState: ', inputState);

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
                            if(didHitBound === 'right') {
                                obj.velocity.x *= -1;
                                state.spielStand.left++;
                            } else if(didHitBound === 'left') {
                                obj.velocity.x *= -1;
                                state.spielStand.right++;
                            } else {
                                obj.velocity.y *= -1;
                            }
                        }

                        // Paddle-Kollision
                        const didHit = collisionDetectionArr(obj, state['objects'].slice(-2));
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
                        if(inputState && inputState.to.type === 'keydown') {
                            let bewegungsRichtung = 0;
                            if(inputState.to.name === 'ArrowDown') { bewegungsRichtung = 1;}
                            else if(inputState.to.name === 'ArrowUp') { bewegungsRichtung = -1;}
                          
                            obj.y = obj.y += bewegungsRichtung * (obj.velocity.y*deltaTime);
                        }
                    }
                    
                });
            }
        } 
        return state;
    }
  
    const timer$ = timer(120000);

    // Stream von Events (hier Zahlen) die mit jedem Animation Frame des Browsers ausgesendet 
    // werden. share() wird verwendet damit sich subscriber bei Frame einschreiben können ohne das 
    // Seiteeffekte wiederholt werden.
    const _frame$ = of(0, animScheduler).pipe(repeat());
    // const _frame$ = defer(() => of(0, animScheduler).pipe(repeat()));
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
    

    // Spielobjekte erstellen ------------------------------------------
    const velocity = 80;
    const wall_distance = 20;
    const paddel_width = 10;
    const paddel_height = 50;
    
    // Padlle links
    const p_l_start_pos = {x: boundaries.left + wall_distance, y: boundaries.top + 200,
        width: paddel_width, height: paddel_height};
    const paddle_left = new ObjToMove(p_l_start_pos.width, p_l_start_pos.height,
        p_l_start_pos.x, p_l_start_pos.y, velocity, velocity, obj_id.P_L);
    // Paddle rechts
    const p_r_start_pos = {x: boundaries.right - wall_distance - paddel_width, y: boundaries.top + 200, 
        width: paddel_width, height: paddel_height};
    const paddle_right = new ObjToMove(p_l_start_pos.width, p_l_start_pos.height,
        p_r_start_pos.x, p_r_start_pos.y, velocity, velocity, obj_id.P_R);

    // Ball (oder mehrere Bälle)
    const ANZAHL_BAELLE = 30;
    const ball = [];
    const ball_radius = 15;
    for(let i = 0; i < ANZAHL_BAELLE; ++i) {
        const x = getRandomInt(50, 350);
        const y = getRandomInt(1, 299);
        const velocityX = getRandomInt(100, 200);
        const velocityY = getRandomInt(100, 200);
        ball.push(new ObjToMove(ball_radius, ball_radius, x, y, velocityX, velocityY,
            obj_id.BALL))
    }
    // End Spielobjekte erstellen --------------------------------------


    const initialState = {
        gameRun: false,
        spielStand: {
            left: 0,
            right: 0
        },
        obj_count: 1,
        objects: [...ball, paddle_left, paddle_right]
    }

    const gameState$ = new BehaviorSubject(initialState);

    // Game-Loop çççççççççççççççççççççççççççççççççççççççççççççççççç
    // Das ist die eigentliche gameLoop!!!
    let lastTimeStamp = Date.now();
    
    frame$.pipe(
        withLatestFrom(keyChangeEvent$, gameState$),
        map( ([_intervallNr, _keyChangeEvent, _gameState]) => {
            // console.log('New Frame---!!!')
            const _now = _intervallNr.timestamp;
            const deltaTime =  _now - lastTimeStamp;
            lastTimeStamp = _now;
            // Hier wird der neue Status anhand des alten und anhand des _keyChangeEvent berechnet.
            // KeyChangeEvent ist der Status der Knöpfe die gedrückt wurden in diesem Frame oder kurz davor.
            return update(deltaTime/1000, _gameState, _keyChangeEvent);
        }),
        tap((game_state) => gameState$.next(game_state))
    ).subscribe((_game_state) => {
        renderObj.render(_game_state);
    });
    
    // gameArea.dispatchEvent(new KeyboardEvent('keypress',{'key':'a'}));
    // startButton.addEventListener('click', (ev) => {
    //     frame$
    // });

    // stopButton.addEventListener('click', (ev) => {
    //     frame$.unsubscribe();
    // });

    
    // End Game-Loop çççççççççççççççççççççççççççççççççççççççççççççç
})();
