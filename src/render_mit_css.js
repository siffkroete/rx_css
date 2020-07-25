import styledash from './styledash.js';

const obj_name = {
    'NO_OBJ': 'NO_OBJ',
    'BALL': 'BALL',
    'P_L': 'P_L',
    'P_R': 'P_R'
}

export const Render = (function() {
    var renderInstance = null;
    
    
    var RenderClass = function(renderContext) {
        this.renderContext = renderContext;
        this.objects = [];
    };

    RenderClass.prototype.initialRender = function(state) {
        const gameArea = this.renderContext;

        const _this = this;
        // 
        // <div id="paddle_left"></div>
        // <div id="paddle_right"></div>
         // Objekte sind noch nicht gerendert, also rendern und an renderContext anhängen
         state['objects'].forEach((obj) => {
             if(obj.name === obj_name.BALL) {
                 const ball_div = '<div id="ball"></div>';
                _this.renderContext.innerHTML = _this.renderContext.innerHTML + ball_div;
                 styledash(gameArea).set('ball-x', obj.x);
                 styledash(gameArea).set('ball-y', obj.y);
             } else if(obj.name === obj_name.P_L) {
                const left_paddle = '<div id="paddle_left"></div>';
                _this.renderContext.innerHTML = _this.renderContext.innerHTML + left_paddle;
                 styledash(gameArea).set('paddle-left-x', obj.x);
                 styledash(gameArea).set('paddle-left-y', obj.y);
             } else if(obj.name === obj_name.P_R) {
                const right_paddle = '<div id="paddle_right"></div>';
                _this.renderContext.innerHTML = _this.renderContext.innerHTML + right_paddle;
                 styledash(gameArea).set('paddle-right-x', obj.x);
                 styledash(gameArea).set('paddle-right-y', obj.y);
             }
             this.objects.push(obj);
         });
    }

    RenderClass.prototype.render = function(state) {
        // console.log('this: ', this);
        const gameArea = this.renderContext;

        // Wenn die Klasseneigenen Objekte nicht der Zahl der Objekte im state entsprechen, heisst das,
        // dass noch nicht alle gerendert worden sind. Dies ist am wahrscheinlichsten beim 1 Aufruf
        // der Fall. Also hier initil-render
        if(this.objects.length !== state['objects'].length) {
           this.initialRender(state);
           return;
        }

        // Render all of our objects (simple rectangles for simplicity)
        state['objects'].forEach((obj) => {
            // console.log(obj.name);
            if(obj.name === obj_name.BALL) {
                styledash(gameArea).set('ball-x', obj.x);
                styledash(gameArea).set('ball-y', obj.y);
            } else if(obj.name === obj_name.P_L) {
                styledash(gameArea).set('paddle-left-x', obj.x);
                styledash(gameArea).set('paddle-left-y', obj.y);
            } else if(obj.name === obj_name.P_R) {
                styledash(gameArea).set('paddle-right-x', obj.x);
                styledash(gameArea).set('paddle-right-y', obj.y);
            }
        });
    }

    return function(renderContext) {
        if(renderInstance === null) {
            renderInstance = new RenderClass(renderContext);
        }
        return renderInstance;
    }
   
})();
