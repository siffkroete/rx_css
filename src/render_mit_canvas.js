var RenderClass = (function() {
    var renderInstance = null;
    var Render = function(renderContext) {
        this.renderContext = renderContext;
    };

    Render.prototype.render = function(state) {
        const ctx = this.renderContext;

        // Clear the canvas
        ctx.clearRect(0, 0, gameArea.clientWidth, gameArea.clientHeight);
    
        // Render all of our objects (simple rectangles for simplicity)
        state['objects'].forEach((obj) => {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        });

        infoDivLeft.innerText = state.spielStand.left;
        infoDivRight.innerText = state.spielStand.right;
    }

    return function getInstance(renderContext) {
        if(renderClass === null) renderClass = new RenderClass(renderContext);
    }
})();