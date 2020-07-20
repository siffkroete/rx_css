import { BehaviorSubject, Observable, of, fromEvent } from 'rxjs';
import { buffer, bufferCount, expand, filter, map, switchMap, takeUntil, merge, takeWhile, take,
    share, tap, withLatestFrom } from 'rxjs/operators';
import styledash from "../styledash.js";
import "./css/index.css";
import { animationFrameScheduler as animScheduler } from 'rxjs';
import { interval } from 'rxjs';



(function start(input) {
    const spielfeld = document.getElementById('spielfeld');
    if(!spielfeld) console.log('Kein Spielfeld!!!');
    const infoDiv = document.getElementById('info');

    var oldTimeStamp = 0;

    const mousedown$ = fromEvent(document, 'mousedown');
    const mousemove$ = fromEvent(document, 'mousemove');
    const mouseup$ = fromEvent(document, 'mouseup');

    const drag$ = mousedown$.pipe(
        switchMap(
          (start) => {
            console.log('switchMap(..) start:---------', start);
            return mousemove$.pipe(
                map(move => {
                    move.preventDefault();
                    return {
                        x: move.clientX - start.offsetX,
                        y: move.clientY - start.offsetY
                    }
                }),
                takeUntil(mouseup$)
            );
          }
        )
    );

    drag$.subscribe((ev) => { 
        styledash(spielfeld).set('mouse-x', ev.x);
        styledash(spielfeld).set('mouse-y', ev.y);
    });

    const keydown$ = fromEvent(document, 'keydown');
    const keyup$ = fromEvent(document, 'keyup');

    const interval$ = interval(0, animScheduler);

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


    let coord = {'x': 20, 'y':20};

    arrowMove$.subscribe((keyCode) => { 
        if(keyCode === 40) {
            coord.y += 1;
        } else if(keyCode === 38) {
            coord.y -= 1;
        } else if(keyCode === 37) {
            coord.x -= 1;
        } else if(keyCode === 39) {
            coord.x += 1;
        }
        
        styledash(myContent).set('mouse-x', coord.x);
        styledash(myContent).set('mouse-y', coord.y);
    });
    
})();