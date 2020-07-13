import { BehaviorSubject, Observable, of, fromEvent } from 'rxjs';
import { buffer, bufferCount, expand, filter, map, switchMap, takeUntil, share, tap, withLatestFrom } from 'rxjs/operators';
import styledash from "./styledash.js";
import "./css/index.css";
import { animationFrameScheduler } from 'rxjs';
import { interval } from 'rxjs';



(function start(input) {
    const myContent = document.getElementById('myContent');
    if(!myContent) throw new Exception('Kein Content!!!');
    const infoDiv = document.getElementById('info');

    var oldTimeStamp = 0;


    const mousedown$ = fromEvent(document, 'mousedown');
    const mousemove$ = fromEvent(document, 'mousemove');
    const mouseup$ = fromEvent(document, 'mouseup');


    const drag$ = mousedown$.pipe(
        switchMap(
          (start) => {
              console.log('switchMap(..) start..');
            return mousemove$.pipe(map(move => {
              move.preventDefault();
              return {
                x: move.clientX - start.offsetX,
                y: move.clientY - start.offsetY
              }
            }),
            tap((coord) => {
                styledash(myContent).set('mouse-x', coord.x);
                styledash(myContent).set('mouse-y', coord.y);
            }),
            takeUntil(mouseup$));
          }
        )
    );

          drag$.subscribe(() => { console.log('Hie')})
    
})();