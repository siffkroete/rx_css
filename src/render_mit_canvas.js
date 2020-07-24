export const Render = (function() {
    var renderInstance = null;
    
    var RenderClass = function(renderContext) {
        this.renderContext = renderContext;
    };

    RenderClass.prototype.render = function(state) {
        // console.log('this: ', this);
        const gameArea = this.renderContext;
        const ctx = this.renderContext.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, gameArea.clientWidth, gameArea.clientHeight);
    
        // Render all of our objects (simple rectangles for simplicity)
        state['objects'].forEach((obj) => {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        });
    }

    return function(renderContext) {
        if(renderInstance === null) renderInstance = new RenderClass(renderContext);
        return renderInstance;
    }
   
})();
