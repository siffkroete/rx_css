export const boundaryDetection = (obj_1, obj_2) => {
    // console.log('obj_1: ', obj_1, 'obj_2: ', obj_2);
    let boundaryHit = '';
    if (obj_1.x + obj_1.width > obj_2.right) {
      boundaryHit = 'right';
      //obj_1.velocity.x *= - bounceRateChanges.right;
      obj_1.x = obj_2.right - obj_1.width;
    } else if (obj_1.x < obj_2.left) {
      //obj_1.velocity.x *= -bounceRateChanges.left;
      boundaryHit = 'left';
      obj_1.x = obj_2.left;
    }
    if(obj_1.y + obj_1.height >= obj_2.bottom) {        
      //obj_1.velocity.y *= -bounceRateChanges.bottom;
      boundaryHit = 'bottom';
      obj_1.y = obj_2.bottom - obj_1.height;
    } else if (obj_1.y < obj_2.top) {
      //obj_1.velocity.y *= -bounceRateChanges.top;
      boundaryHit = 'top';
      obj_1.y = obj_2.top;
    }
    return boundaryHit;
};

export const collisionDetection2Obj = (obj_1, obj_2) => {
    let hit = '';
    let tolerance = 3; 
    let abstandRechts = Math.abs((obj_1.x + obj_1.width) - obj_2.x);
    let abstandLinks = Math.abs((obj_1.x - obj_2.x));
    if( abstandRechts < tolerance) {
        let untenVorbei = true;
        let obenVorbei = true;
        // Das obj_1 ist noch nicht am obj_2 vorbei (vertikal)
        if(obj_1.y < obj_2.y + obj_2.height) untenVorbei = false;
        if(obj_1.y + obj_1.height > obj_2.y) obenVorbei = false; 
        console.log('Abstand Rechts: ' + abstandRechts,
        'untenVorbei: ' + untenVorbei + 'obenVorbei: ' + obenVorbei );
        console.log('Rechts Kollision: xxx 1: ', (obj_1.x + obj_1.width), 'xxx 2: ', obj_2.x);
        if(!untenVorbei && !obenVorbei) {
            hit = 'right';
        }
    } else if (abstandLinks < tolerance) {
        let untenVorbei = true;
        let obenVorbei = true;
        // Das obj_1 ist noch nicht am obj_2 vorbei (vertikal)
        if(obj_1.y < obj_2.y + obj_2.height) untenVorbei = false;
        if(obj_1.y + obj_1.height > obj_2.y) obenVorbei = false; 
        console.log('Abstand Rechts: ' + abstandRechts,
        'untenVorbei: ' + untenVorbei + 'obenVorbei: ' + obenVorbei );
        console.log('Rechts Kollision: xxx 1: ', (obj_1.x + obj_1.width), 'xxx 2: ', obj_2.x);
        if(!untenVorbei && !obenVorbei) {
            hit = 'left';
        }
    } 
    return hit;
}

export const collisionDetectionArr = (obj, arr) => {
    let collision = false;
    let arrLength = 0;
    arrLength = arr.length;
    // console.log('arr.length: ', arrLength);
    for(let i = 0; i < arrLength; ++i) {
        const hit = collisionDetection2Obj(obj, arr[i]);
        if(hit === 'left' || hit === 'right' || hit === 'top' || hit === 'bottom') {
            collision = hit;
            break;
        }
    }
    return collision;
};
