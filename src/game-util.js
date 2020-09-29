import { v_abs, v_normalize, v_dot_product, v_obj_to_arr, v_arr_to_obj } from './vector-util';

export const LEFT = 1;
export const TOP = 2;
export const RIGHT = 4;
export const BOTTOM = 8;

export const boundaryDetection = (obj_1, obj_2) => {
    // console.log('obj_1: ', obj_1, 'obj_2: ', obj_2);
    let boundaryHit = 0;
    if (obj_1.right >= obj_2.right) {
      boundaryHit = RIGHT;
    } else if (obj_1.left <= obj_2.left) {
      boundaryHit = LEFT;
    } else if(obj_1.bottom >= obj_2.bottom) {        
      boundaryHit = BOTTOM;
    } else if (obj_1.top <= obj_2.top) {
      boundaryHit = TOP;
    }
    return boundaryHit;
};

export const collisionDetectionBallPaddle = (obj_1, obj_2) => {
    let hit = 0;
    let tolerance = 2;

    let abstandRechts = Math.abs( obj_1.right - obj_2.left );
    let abstandLinks = Math.abs( obj_1.left - obj_2.right );

    if( abstandRechts <= tolerance) {
        let untenVorbei = true;
        let obenVorbei = true;
        // Das obj_1 ist noch nicht am obj_2 vorbei (vertikal)
        if(obj_1.y < obj_2.y + obj_2.height) untenVorbei = false;
        if(obj_1.y + obj_1.height > obj_2.y) obenVorbei = false; 
        // console.log('Abstand Rechts: ' + abstandRechts,
        // 'untenVorbei: ' + untenVorbei + 'obenVorbei: ' + obenVorbei );
        // console.log('Rechts Kollision: xxx 1: ', (obj_1.x + obj_1.width), 'xxx 2: ', obj_2.x);
        if(!untenVorbei && !obenVorbei) {
            hit = RIGHT;
        }
    } else if (abstandLinks <= tolerance) {
        let untenVorbei = true;
        let obenVorbei = true;
        // Das obj_1 ist noch nicht am obj_2 vorbei (vertikal)
        if(obj_1.y < obj_2.y + obj_2.height) untenVorbei = false;
        if(obj_1.y + obj_1.height > obj_2.y) obenVorbei = false; 
        // console.log('Abstand Rechts: ' + abstandRechts,
        // 'untenVorbei: ' + untenVorbei + 'obenVorbei: ' + obenVorbei );
        // console.log('Rechts Kollision: xxx 1: ', (obj_1.x + obj_1.width), 'xxx 2: ', obj_2.x);
        if(!untenVorbei && !obenVorbei) {
            hit = LEFT;
        }
    } 
    return hit;
}

export const collisionDetectionBallPaddleArr = (obj, arr) => {
    let collision = 0;
    let arrLength = 0;
    arrLength = arr.length;
    // console.log('arr.length: ', arrLength);
    for(let i = 0; i < arrLength; ++i) {
        const hit = collisionDetectionBallPaddle(obj, arr[i]);
        if(hit > 0) {
            collision = hit;
            break;
        }
    }
    return collision;
};

export const collisionDetection2Balls = (obj_1, obj_2) => {
    const twoRad = obj_1.radius + obj_2.radius;
    const distanceX = obj_1.x - obj_2.x;
    const distanceY = obj_1.y -  obj_2.y;
    const distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
    return (distance <= twoRad);
}

export const calcCollision2Balls = (obj_1, obj_2) => {
    const v_relative = [obj_1.velocity.x - obj_2.velocity.x, obj_1.velocity.y - obj_2.velocity.y];
    const v_distance = [obj_2.x - obj_1.x, obj_2.y - obj_1.y];
    const v_collision_norm = v_normalize(v_distance);

    const collision_speed = v_dot_product(v_relative, v_collision_norm);
    if(collision_speed <= 0) {
        return false;
    }

    obj_1.velocity.x -= (collision_speed * v_collision_norm[0]);
    obj_1.velocity.y -= (collision_speed * v_collision_norm[1]);
    obj_2.velocity.x += (collision_speed * v_collision_norm[0]);
    obj_2.velocity.y += (collision_speed * v_collision_norm[1]);
    return true;
}

export const collisionDetectionAllBalls = (objs, start_idx, ball_count) => {
    // Alle Bälle mit allen Bällen auf Kollision prüfen mit doppelter for-Schleife
    for(let i = start_idx; i < ball_count - 1; ++i) {
        let firstBall = objs[i];
        if(firstBall.name !== 'BALL') continue; // Nur Bälle hier berechnen
        for(let j = i + 1; j < start_idx + ball_count; ++j) {
            let secondBall = objs[j];
            if(secondBall.name !== 'BALL') continue; // Nur Bälle hier berechnen
            if(firstBall.id === secondBall.id) continue; // Ball kann nicht mit sich selbst kollidieren.
            if(collisionDetection2Balls(firstBall, secondBall)) { // Gibt es eine Kollision?
                // Dann Geschwindigkeit nach der Kollision berechnen
                calcCollision2Balls(firstBall, secondBall);
            }
        }
    }
}


export const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
