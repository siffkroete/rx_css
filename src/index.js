const Rx = require('rxjs');
import { fromEvent} from 'rxjs';
import { map } from 'rxjs';
import RxCSS from 'rxcss';
import "./css/index.css";


(function start(input) {

    const mouse$ = fromEvent(document, 'mousemove');
    mouse$.map(({ clientX, clientY }) => ({
        x: clientX,
        y: clientY
    }));


    const style$ = RxCSS({
        mouse: mouse$,
    });


})();