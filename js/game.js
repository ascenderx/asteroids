/****************************************************************************
 * GAME : CONSTRUCTOR
 ****************************************************************************/
function Game(cvs, ctx, fps) {
    // get canvas and context
    this.cvs = gel('cvs');
    this.ctx = this.cvs.getContext('2d');
    
    // initialize logic variables
    this.FPS = fps;
    this.paused = false;
    this.callbacks = [];
    
    // set game boundaries
    let padding = 10;
    this.edges = {
        top:    0 - padding,
        left:   0 - padding,
        right:  this.cvs.width  + padding,
        bottom: this.cvs.height + padding,
    };
    
    // create background stars
    let NUM_STARS  = 100;
    this.stars     = [];
    let STAR_DIR   = randomInt(0, 359);
    let STAR_SPEED = 1;
    this.STAR_DX   = STAR_SPEED * Math.cos(degToRad(STAR_DIR));
    this.STAR_DY   = STAR_SPEED * Math.sin(degToRad(STAR_DIR));
    for (let s = 0; s < NUM_STARS; s++) {
        let x = randomInt(this.edges.left, this.edges.right);
        let y = randomInt(this.edges.top,  this.edges.bottom);
        
        this.stars.push({
            center: [x, y],
            color:  colorStringHSL(0, 0, randomInt(30, 100)),
        });
    }
    
    // create background shooting stars
    // TODO: FIX ERRANT STAR TAILS
    // let NUM_S_STARS     = 10;
    // let S_STAR_SPEED    = STAR_SPEED * 1.5;
    // let sStarHues       = [200, 270, 300];
    // let S_STAR_INIT_LUM = 50;
    // this.shootingStars  = [];
    // this.S_STAR_LENGTH  = 10;
    // this.S_STAR_SPACING = 5;
    // this.S_STAR_DX      = S_STAR_SPEED * Math.cos(degToRad(STAR_DIR));
    // this.S_STAR_DY      = S_STAR_SPEED * Math.sin(degToRad(STAR_DIR));
    // for (let s = 0; s < NUM_S_STARS; s++) {
    //     let x    = randomInt(this.edges.left, this.edges.right);
    //     let y    = randomInt(this.edges.top,  this.edges.bottom);
    //     let tail = [];
    //     let hue  = sStarHues[randomInt(0, sStarHues.length - 1)];
    //     for (let t = 0; t < this.S_STAR_LENGTH; t++) {
    //         let lum = S_STAR_INIT_LUM * (t / this.S_STAR_LENGTH);
    //         let xt  = x + (t * this.S_STAR_DX * this.S_STAR_SPACING);
    //         let yt  = y + (t * this.S_STAR_DY * this.S_STAR_SPACING);
    //         tail.push({
    //             center: [xt, yt],
    //             color:  colorStringHSL(hue, 100, lum),
    //         });
    //     }
    //     this.shootingStars.push(tail);
    // }
    
    // create the player
    let x = (this.edges.right  - this.edges.left) / 2;
    let y = (this.edges.bottom - this.edges.top)  / 2;
    this.player   = new Player([x, y], this.cvs, this.ctx);
    this.score    = 0;
    this.maxSpeed = 10;
    this.MAX_BULLET_LIFE = 50;
}

/****************************************************************************
 * GAME : KEYS MAP
 ****************************************************************************/
Game.prototype.keys = {};

/****************************************************************************
 * GAME: FIRE KEY
 ****************************************************************************/
Game.prototype.fireKey = function(key) {
    if (!this.keys[key]) {
        this.keys[key] = 0;
    }
    this.keys[key]++;
};

/****************************************************************************
 * GAME : RELEASE KEY
 ****************************************************************************/
Game.prototype.releaseKey = function(key) {
    if (this.keys[key]) {
        delete this.keys[key];
    }
};

/****************************************************************************
 * GAME : DETECT INPUT
 ****************************************************************************/
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
            this.player.fireBullet(7);
        }
    }
    
    if (this.keys.KeyP) {
        this.paused = !this.paused;
        this.releaseKey('KeyP');
    }
};

/****************************************************************************
 * GAME : UPDATE
 ****************************************************************************/
Game.prototype.update = function() {
    if (!this.paused) {
        // update the player
        if (this.player) {
            this.player.update();
        }
        
        // update the bullets
        for (let b = 0; b < this.player.bullets.length; b++) {
            if ((this.MAX_BULLET_LIFE <= 0) || (this.player.bullets[b].life <= this.MAX_BULLET_LIFE)) {
                this.player.bullets[b].update();
            } else {
                this.player.bullets[b].kill();
            }
        }
    }

    // update the stars
    for (let s = 0; s < game.stars.length; s++) {
        let star = game.stars[s];
        star.center[X] += game.STAR_DX;
        star.center[Y] += game.STAR_DY;
    }
    
    // // update the shooting stars
    // new Promise(function() {
    //     for (let s = 0; s < game.shootingStars.length; s++) {
    //         let sStar = game.shootingStars[s];
    //         for (let t = 0; t < sStar.length; t++) {
    //             sStar[t].center[X] += game.S_STAR_DX;
    //             sStar[t].center[Y] += game.S_STAR_DY;
    //         }
    //     }
    // });
};

/****************************************************************************
 * GAME : WRAP OBJECTS AROUND BORDERS
 ****************************************************************************/
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

/****************************************************************************
 * GAME : DETECT COLLISIONS
 ****************************************************************************/
Game.prototype.detectCollisions = function() {
    if (!this.paused) {
        // wrap the player
        if (this.player) {
            this.wrap(this.player);
        }
        
        // wrap the bullets
        for (let b = 0; b < this.player.bullets.length; b++) {
            this.wrap(this.player.bullets[b]);
        }
    }
    
    // wrap the stars
    for (let s = 0; s < this.stars.length; s++) {
        this.wrap(this.stars[s]);
    }
    
    // // wrap the shooting stars
    // for (let s = 0; s < this.shootingStars.length; s++) {
    //     let sStar = this.shootingStars[s];
    //     for (let t = 0; t < sStar.length; t++) {
    //         this.wrap(sStar[t]);
    //     }
    // }
};

/****************************************************************************
 * GAME : DRAW BACKGROUND
 ****************************************************************************/
Game.prototype.drawBG = function() {
    // draw the black background
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    
    // draw the stars
    for (let s = 0; s < this.stars.length; s++) {
        let star = this.stars[s];
        this.ctx.fillStyle = star.color;
        this.ctx.fillRect(star.center[X], star.center[Y], 2, 2);
    }
    
    // // draw the shooting stars
    // for (let s = 0; s < this.shootingStars.length; s++) {
    //     let sStar = this.shootingStars[s];
    //     for (let t = 0; t < this.S_STAR_LENGTH; t++) {
    //         drawPoint(this.ctx, sStar[t].center, sStar[t].color);
    //     }
    // }
};

/****************************************************************************
 * GAME : DRAW FOREGROUND
 ****************************************************************************/
Game.prototype.drawFG = function() {
    // draw player
    if (this.player) {
        this.player.draw(this.cvs, this.ctx);
    }
    
    // draw bullets
    for (let b = 0; b < this.player.bullets.length; b++) {
        this.player.bullets[b].draw(this.cvs, this.ctx);
    }
};

/****************************************************************************
 * GAME : CLEAN UP OLD MEMORY
 ****************************************************************************/
Game.prototype.cleanUp = function() {
    if (!this.paused) {
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
    }
};

/****************************************************************************
 * GAME : ADD CALLBACK
 ****************************************************************************/
Game.prototype.addCallback = function(cb) {
    this.callbacks.push(cb);
};

/****************************************************************************
 * GAME : RUN
 ****************************************************************************/
Game.prototype.run = function() {
    let game = this;
    setInterval(function() {
        game.detectInput();
        game.update();
        game.detectCollisions();
        game.cleanUp();
        game.drawBG();
        game.drawFG();
        
        // fire callbacks
        for (let c = 0; c < game.callbacks.length; c++) {
            game.callbacks[c](game);
        }
    }, 1000/game.FPS);
};