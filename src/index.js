import { BehaviorSubject, Observable, of, fromEvent } from 'rxjs';
import { buffer, bufferCount, expand, filter, map,  share, tap, withLatestFrom } from 'rxjs/operators';
import RxCSS from 'rxcss';
import styledash from "./styledash.js";
import "./css/index.css";


(function start(input) {
    const myContent = document.getElementById('myContent');
    if(!myContent) throw new Exception('Kein Content!!!');
    const infoDiv = document.getElementById('info');
    const mouse$ = fromEvent(document, 'mousemove')
    .pipe(
        map( (mouseEvent) => ({
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
            which: mouseEvent.which
        }))
    );

    mouse$.subscribe((ev) => {
        console.log(ev.which);
        if(ev.which == 1) {
            styledash(myContent).set('mouse-x', ev.x);
            styledash(myContent).set('mouse-y', ev.y);
        }
    });

    
    


})();