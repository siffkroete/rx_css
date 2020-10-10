import { boundaryDetection, collisionDetectionBallPaddleArr, getRandomInt,
    collisionDetection2Balls, calcCollision2Balls, collisionDetectionAllBalls,
    LEFT, TOP, RIGHT, BOTTOM } from './game-util.js';

export var GameModel = (function() {

    function ObjToMove(width, height, x,y, velocity, angle, _name, _id) {
        this.name = _name;
        this.id = _id;

        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        this.left = x-width/2;
        this.top = y-height/2;
        this.right = x + width/2;
        this.bottom = y + height/2;

        this.radius = width/2;
        
        this.velocity = {
            x: velocity * Math.cos(angle),
            y: velocity * Math.sin(angle)
        }
    }

    ObjToMove.prototype.move = function(delta_x, delta_y) {
        this.x += delta_x;
        this.y += delta_y;
        
        this.left += delta_x;
        this.top += delta_y;
        this.right += delta_x;
        this.bottom += delta_y;
    }

    const boundaries = {
        left: 0,
        top: 0,
        bottom: 600,
        right: 800
    };

    // Spielobjekte erstellen ------------------------------------------
    const obj_name = {
        'NO_OBJ': 'NO_OBJ',
        'BALL': 'BALL',
        'P_L': 'P_L',
        'P_R': 'P_R'
    }

    const velocityPaddle = 150;
    const angleVelocityPaddle = 3.14 / 2;
    const wall_distance = 20;
    const paddel_width = 10;
    const paddel_height = 50;


    // Padlle links
    const p_l_start_pos = {x: boundaries.left + wall_distance, y: boundaries.top + 200,
        width: paddel_width, height: paddel_height};
    const paddle_left = new ObjToMove(p_l_start_pos.width, p_l_start_pos.height,
        p_l_start_pos.x, p_l_start_pos.y, velocityPaddle, angleVelocityPaddle, obj_name.P_L, 1);

    // Paddle rechts
    const p_r_start_pos = {x: boundaries.right - wall_distance - paddel_width, y: boundaries.top + 200, 
        width: paddel_width, height: paddel_height};
    const paddle_right = new ObjToMove(p_l_start_pos.width, p_l_start_pos.height,
        p_r_start_pos.x, p_r_start_pos.y, velocityPaddle, angleVelocityPaddle, obj_name.P_R, 2);


    // Ball (oder mehrere Bälle)
    const ANZAHL_BAELLE = 2;
    const ball = [];
    const ball_radius = 10;
    const velocityBall = 200;
    for(let i = 0; i < ANZAHL_BAELLE; ++i) {
        let x_pos = getRandomInt(50, 350);
        let y_pos = getRandomInt(1, 299);
        let angleVelocityBall = (getRandomInt(0, 2*314) / 100);
        ball.push(new ObjToMove(ball_radius * 2, ball_radius * 2, x_pos, y_pos,
            velocityBall, angleVelocityBall, obj_name.BALL, i + 3))
    }
    // End Spielobjekte erstellen --------------------------------------


    function GameModel() {
       
        this.state = {
            spielStand: {
                left: 0,
                right: 0
            },
            obj_count: ball.length + 2, // Anzahl Bälle + 2 Paddle
            objects: [...ball, paddle_left, paddle_right]
        }

        this.gameRun = false;
    }

    GameModel.prototype.getInitialState = function() {
        return this.state;
    }

    GameModel.prototype.updateState = function(deltaTime, state, inputState) {
        if(!this.gameRun) return state;
    
        if((z%100) == 0) console.log('inputState: ', inputState);

        if(!(state && state['objects'] !== undefined && state['objects'].length > 0)) { return state; }
            
        state['objects'].forEach((obj) => {
            // if((z%100) == 0) console.log('obj: ', obj);
            // console.log('obj.name = obj.BALL: ' + 'obj.name: ' + obj.name + 'obj.BALL: ' + obj.BALL)
            if(obj.name === obj_name.BALL) {
                let delta_x = obj.velocity.x*deltaTime;
                let delta_y = obj.velocity.y*deltaTime;
                obj.move(delta_x, delta_y);
            
                // Grenz-Kollision
                const didHitBound = boundaryDetection(obj, boundaries);
                if(didHitBound) {
                    if(didHitBound === RIGHT) {
                        obj.velocity.x *= -1;
                        state.spielStand.left++;
                    } else if(didHitBound === LEFT) {
                        obj.velocity.x *= -1;
                        state.spielStand.right++;
                    } else {
                        obj.velocity.y *= -1;
                    }
                }

                // Paddle-Kollision
                const didHit = collisionDetectionBallPaddleArr(obj, state['objects'].slice(-2));
                if(didHit) {
                    if(didHit === RIGHT || didHit === LEFT) {
                        obj.velocity.x *= -1;
                    } else {
                        obj.velocity.y *= -1;
                    }
                }
            } else if(obj.name === obj_name.P_L) {
                if(inputState && inputState.to.type === 'keydown') {
                    let bewegungsRichtung = 0;
                    if(inputState.to.name === 'ArrowDown') { bewegungsRichtung = 1;}
                    else if(inputState.to.name === 'ArrowUp') { bewegungsRichtung = -1;}
                    
                    let delta_y = bewegungsRichtung * (obj.velocity.y*deltaTime);
                    obj.move(0, delta_y); 
                }
            } else if(obj.name === obj_name.P_R) {
                if(inputState && inputState.to.type === 'keydown') {
                    let bewegungsRichtung = 0;
                    if(inputState.to.name === 'ArrowDown') { bewegungsRichtung = 1;}
                    else if(inputState.to.name === 'ArrowUp') { bewegungsRichtung = -1;}
                    
                    let delta_y = bewegungsRichtung * (obj.velocity.y*deltaTime);
                    obj.move(0, delta_y); 
                }
            }
        });

        // Ball-Ball-Collision
        if(ANZAHL_BAELLE > 1) {
            collisionDetectionAllBalls(state['objects'], 0, ANZAHL_BAELLE);
        }

        this.state = state;
        return state;
    }

    var instance = null;

    GameModel.getInstance = function() {
        if(!instance) instance = new GameModel();
        return instance;
    }
    
    return GameModel;
})();
