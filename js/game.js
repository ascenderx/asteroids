function Game(cvs, ctx, fps) {
    this.cvs = gel('cvs');
    this.ctx = this.cvs.getContext('2d');
    this.FPS = fps;
    this.MAX_BULLET_LIFE = 100;
    this.paused = false;
    
    padding = 10;
    this.edges = {
        top:    0 - padding,
        left:   0 - padding,
        right:  this.cvs.width  + padding,
        bottom: this.cvs.height + padding,
    };
    
    NUM_STARS  = 40;
    this.stars = [];
    STAR_DIR     = randomInt(0, 359);
    STAR_SPEED   = 0.3;
    this.STAR_DX = STAR_SPEED * Math.cos(degToRad(STAR_DIR));
    this.STAR_DY = STAR_SPEED * Math.sin(degToRad(STAR_DIR));
    
    for (let s = 0; s < NUM_STARS; s++) {
        let lum   = randomInt(75, 255);
        let color = colorStringRGB(lum, lum, lum);
        let x     = randomInt(this.edges.left, this.edges.right);
        let y     = randomInt(this.edges.top,  this.edges.bottom);
        
        this.stars.push({
            center: [x, y],
            color:  color,
        });
    }
    
    let x = (this.edges.right  - this.edges.left) / 2;
    let y = (this.edges.bottom - this.edges.top)  / 2;
    this.player = new Player([x, y], this.cvs, this.ctx);
    this.score  = 0;
    this.maxSpeed = 10;
    
    this.callbacks = [];
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

Game.prototype.detectInput = function() {
    if (this.player && !this.paused) {
        if (this.keys.ArrowLeft || this.keys.KeyA) {
            this.player.rotate(+5);
        } else if (this.keys.ArrowRight || this.keys.KeyD) {
            this.player.rotate(-5);
        }
        
        if (this.keys.ArrowUp || this.keys.KeyW) {
            this.player.thrust(1, this.maxSpeed);
        } else if (this.keys.ArrowDown || this.keys.KeyS) {
            this.player.throttle(1);
        }
        
        if (this.keys.Space) {
            this.player.fireBullet(5);
        }
    }
    
    if (this.keys.KeyP) {
        this.paused = !this.paused;
        this.releaseKey('KeyP');
    }
};

Game.prototype.update = function() {
    if (this.player) {
        this.player.update();
    }
    
    for (let b = 0; b < this.player.bullets.length; b++) {
        if (this.player.bullets[b].life <= this.MAX_BULLET_LIFE) {
            this.player.bullets[b].update();
        } else {
            this.player.bullets[b].kill();
        }
    }
    
    for (let s = 0; s < this.stars.length; s++) {
        let star = this.stars[s];
        star.center[X] += this.STAR_DX;
        star.center[Y] += this.STAR_DY;
    }
};

Game.prototype.wrap = function(entity) {
    if (entity) {
        if (entity.center[X] > this.edges.right) {
            entity.center = [
                this.edges.left,
                this.edges.bottom - entity.center[Y],
            ];
        } else if (entity.center[X] < this.edges.left) {
            entity.center = [
                this.edges.right,
                this.edges.bottom - entity.center[Y],
            ];
        }
        
        if (entity.center[Y] > this.edges.bottom) {
            entity.center = [
                this.edges.right - entity.center[X],
                this.edges.top,
            ];
        } else if (entity.center[Y] < this.edges.top) {
            entity.center = [
                this.edges.right - entity.center[X],
                this.edges.bottom,
            ];
        }
    }
};

Game.prototype.detectCollisions = function() {
    if (this.player) {
        this.wrap(this.player);
    }
    
    for (let b = 0; b < this.player.bullets.length; b++) {
        this.wrap(this.player.bullets[b]);
    }
    
    for (let s = 0; s < this.stars.length; s++) {
        this.wrap(this.stars[s]);
    }
};
    
Game.prototype.drawBG = function() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    
    for (let s = 0; s < this.stars.length; s++) {
        let star = this.stars[s];
        this.ctx.fillStyle = star.color;
        this.ctx.fillRect(star.center[X], star.center[Y], 2, 2);
    }
};

Game.prototype.drawFG = function() {
    if (this.player) {
        this.player.draw(this.cvs, this.ctx);
    }
    
    for (let b = 0; b < this.player.bullets.length; b++) {
        this.player.bullets[b].draw(this.cvs, this.ctx);
    }
};

Game.prototype.cleanUp = function() {
    if (this.player) {
        if (!this.player.isAlive()) {
            delete this.player;
        } else {
            for (let b = 0; b < this.player.bullets.length; b++) {
                if (!this.player.bullets[b].isAlive()) {
                    delete this.player.bullets[b];
                    this.player.bullets.splice(b, 1);
                    b--;
                }
            }
        }
    }
};

Game.prototype.addCallback = function(cb) {
    this.callbacks.push(cb);
};

Game.prototype.run = function() {
    let game = this;
    setInterval(function() {
        game.detectInput();
        if (!game.paused) {
            game.detectCollisions();
            game.update();
            game.cleanUp();
            game.drawBG();
            game.drawFG();
        }
        
        // fire callbacks
        for (let c = 0; c < game.callbacks.length; c++) {
            game.callbacks[c](game);
        }
    }, 1000/game.FPS);
};