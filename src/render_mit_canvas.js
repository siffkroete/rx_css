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
    
        // Alle Objekte zeichnen
        state['objects'].forEach((obj) => {
            if(obj.name === 'BALL') {
                ctx.beginPath();
                ctx.arc(obj.x, obj.y, obj.width/2, 0, Math.PI*2);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            } else {
                ctx.fillStyle = obj.color;
                ctx.fillRect(obj.left, obj.top, obj.width, obj.height);
            }
        });
    }

    return function(renderContext) {
        if(renderInstance === null) renderInstance = new RenderClass(renderContext);
        return renderInstance;
    }
   
})();
