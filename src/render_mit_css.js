import styledash from './styledash.js';

const obj_id = {
    'NO_OBJ': 0,
    'BALL': 1,
    'P_L': 2,
    'P_R': 3
}

export const Render = (function() {
    var renderInstance = null;
    
    var RenderClass = function(renderContext) {
        this.renderContext = renderContext;
    };

    RenderClass.prototype.render = function(state) {
        // console.log('this: ', this);
        const gameArea = this.renderContext;

        // Render all of our objects (simple rectangles for simplicity)
        state['objects'].forEach((obj) => {
            if(obj.id === obj_id.BALL) {
                styledash(gameArea).set('ball-x', obj.x);
                styledash(gameArea).set('ball-y', obj.y);
            } else if(obj.id === obj_id.P_L) {
                styledash(gameArea).set('paddle-left-x', obj.x);
                styledash(gameArea).set('paddle-left-y', obj.y);
            } else if(obj.id === obj_id.P_R) {
                styledash(gameArea).set('paddle-right-x', obj.x);
                styledash(gameArea).set('paddle-right-y', obj.y);
            }
        });
    }

    return function(renderContext) {
        if(renderInstance === null) renderInstance = new RenderClass(renderContext);
        return renderInstance;
    }
   
})();
