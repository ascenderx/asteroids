function Game(cvs, ctx, fps) {
    this.cvs = gel('cvs');
    this.ctx = this.cvs.getContext('2d');
    this.fps = fps;
    
    let x = this.cvs.width  / 2;
    let y = this.cvs.height / 2;
    this.player = new Player([x, y], this.cvs, this.ctx);
    
    padding = 10;
    this.edges = {
        top:    0 - padding,
        left:   0 - padding,
        right:  this.cvs.width  + padding,
        bottom: this.cvs.height + padding,
    };
    this.maxSpeed = 10;
}

Game.prototype.keys = {};

Game.prototype.fireKey = function(key) {
    if (!this.keys[key]) {
        this.keys[key] = 0;
    }
    this.keys[key]++;
};

Game.prototype.releaseKey = function(key) {
    if (this.keys[key]) {
        delete this.keys[key];
    }
};

Game.prototype.update = function() {
    if (this.keys.ArrowLeft) {
        this.player.rotate(+5);
    } else if (this.keys.ArrowRight) {
        this.player.rotate(-5);
    }
    
    if (this.keys.ArrowUp) {
        this.player.thrust(1, this.maxSpeed);
    } else if (this.keys.ArrowDown) {
        this.player.throttle(1);
    }
    
    this.player.update();
};

Game.prototype.detectCollisions = function() {
    if (this.player) {
        if (this.player.center[X] > this.edges.right) {
            this.player.center = [
                this.edges.left,
                this.edges.bottom - this.player.center[Y],
            ];
        } else if (this.player.center[X] < this.edges.left) {
            this.player.center = [
                this.edges.right,
                this.edges.bottom - this.player.center[Y],
            ];
        }
        
        if (this.player.center[Y] > this.edges.bottom) {
            this.player.center = [
                this.edges.right - this.player.center[X],
                this.edges.top,
            ];
        } else if (this.player.center[Y] < this.edges.top) {
            this.player.center = [
                this.edges.right - this.player.center[X],
                this.edges.bottom,
            ];
        }
    }
};
    
Game.prototype.drawBG = function() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
};

Game.prototype.drawFG = function() {
    this.player.draw();
};

Game.prototype.run = function() {
    let game = this;
    setInterval(function() {
        game.drawBG();
        game.drawFG();
        game.detectCollisions();
        game.update();
    }, 1000/game.fps);
};