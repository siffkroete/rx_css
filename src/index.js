import { BehaviorSubject, Observable, of, fromEvent } from 'rxjs';
import { buffer, bufferCount, expand, filter, map,  share, tap, withLatestFrom } from 'rxjs/operators';
import RxCSS from 'rxcss';

import "./css/index.css";


(function start(input) {

    const mouse$ = fromEvent(document, 'mousemove')
    .pipe(
        map( (clientX, clientY) => ({
            x: clientX,
            y: clientY
        }))
    );

    // const style$ = RxCSS({
    //     mouse: mouse$,
    // });

})();