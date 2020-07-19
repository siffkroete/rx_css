import { BehaviorSubject, Observable, of, fromEvent } from 'rxjs';
import { buffer, bufferCount, expand, filter, map, switchMap, takeUntil, merge, takeWhile, take,
    share, tap, withLatestFrom } from 'rxjs/operators';
import styledash from "./styledash.js";
import "./css/index.css";
import { animationFrameScheduler as animScheduler } from 'rxjs';
import { interval } from 'rxjs';



(function start(input) {
    const spielfeld = document.getElementById('spielfeld');
    const ball = document.getElementById('ball');
    if(!spielfeld) console.log('Kein Spielfeld!!!');
    const infoDiv = document.getElementById('info');

    const ball$ = interval(0, animScheduler);
    const keydown$ = fromEvent(document, 'keydown');
    const keyup$ = fromEvent(document, 'keyup');
    const interval$ = interval(0, animScheduler); //  Intervall wie bei getAnimationFrage(..) des Browsers
    

    const field_border = spielfeld.getBoundingClientRect();

    const ball_pos = {
        x: 200,
        y: 200,
        width: 30,
        height: 30,
        v: {
            x: 1,
            y: 0
        },
        direction: {
            x: Math.cos(0),
            y: Math.sin(0),
            alpha: 0
        }
    };
  
    const arrowMove$ = keydown$.pipe(
        filter(ev => (ev.keyCode === 38 || ev.keyCode === 40 || ev.keyCode === 37 || ev.keyCode === 39)),
        switchMap(
            (kDownEvent) => {
                // console.log('keydown: switchMap(): kDownEvent: ', kDownEvent);
                return interval$.pipe(
                    map( ev => kDownEvent.keyCode),
                    takeUntil(keyup$)
                );
            }
        )
    );


    const coord__paddle_left = {
        x: 15,
        y: 0,
        v: 2
    };

    const units_per_frame = coord__paddle_left.v;

    console.log('coord__paddle_left: ', coord__paddle_left);

    ball$.subscribe(ev => {
        if( (ball_pos.x + ball_pos.width) >= field_border.right 
            || ball_pos.x <= field_border.left) {
            ball_pos.v.x = -ball_pos.v.x;
        }
        // console.log(ball_pos.x);
        ball_pos.x += ball_pos.v.x * ball_pos.direction.x;
        //  ball_pos.y += ball_pos.v * ball_pos.direction.y;
        styledash(spielfeld).set('ball-x', ball_pos.x);
        styledash(spielfeld).set('ball-y', ball_pos.y);
    });

    arrowMove$.subscribe((keyCode) => { 
        if(keyCode === 40) {
            coord__paddle_left.y += units_per_frame;
        } else if(keyCode === 38) {
            coord__paddle_left.y -= units_per_frame;
        } else if(keyCode === 37) {
            coord__paddle_left.x -= units_per_frame;
        } else if(keyCode === 39) {
            coord__paddle_left.x += units_per_frame;
        }
        
        styledash(spielfeld).set('paddle-left-x', coord__paddle_left.x);
        styledash(spielfeld).set('paddle-left-y', coord__paddle_left.y);
    });
    
})();