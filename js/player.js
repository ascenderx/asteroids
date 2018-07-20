function Player(center, cvs, ctx) {
    this.center    = center;
    this.color     = '#f00';
    this.rotation  = 0;
    this.direction = 0;
    this.velocity  = 0;
    this.bullets   = [];
    this.fireSpeed = 0;
}

Player.prototype.points = [
    [ 10,   0],
    [-10,  10],
    [- 5,   0],
    [-10, -10],
];

Player.prototype.rotate = function(deg) {
    if (!deg) {
        return;
    }
    
    this.rotation -= deg;
};

Player.prototype.thrust = function(force, maxSpeed) {
    let radR = degToRad(this.rotation);
    let radD = degToRad(this.direction);
    let cosR = Math.cos(radR);
    let sinR = Math.sin(radR);
    let cosD = Math.cos(radD);
    let sinD = Math.sin(radD);
    
    let newDX    = this.velocity * cosD + force * cosR;
    let newDY    = this.velocity * sinD + force * sinR;
    let newSpeed = Math.sqrt(newDX * newDX + newDY * newDY);
    let newRot   = Math.atan2(newDY, newDX);
    
    if (newSpeed >= maxSpeed) {
        this.velocity = maxSpeed;
    } else {
        this.velocity = newSpeed;
    }
    this.direction = radToDeg(newRot);
};

Player.prototype.throttle = function(force) {
    this.velocity -= force;
    if (this.velocity <= 0) {
        this.velocity = 0;
    }
};

Player.prototype.fireBullet = function(force) {
    let radR = degToRad(this.rotation);
    let radD = degToRad(this.direction);
    let cosR = Math.cos(radR);
    let sinR = Math.sin(radR);
    let cosD = Math.cos(radD);
    let sinD = Math.sin(radD);
    
    let newDX    = this.velocity * cosD + force * cosR;
    let newDY    = this.velocity * sinD + force * sinR;
    let newSpeed = Math.sqrt(newDX * newDX + newDY * newDY);
    
    // perform a deep copy
    let bullet = new Bullet(this.center);
    bullet.fire(newSpeed, this.rotation);
    this.bullets.push(bullet);
};

Player.prototype.update = function() {
    // update self
    let rad  = degToRad(this.direction);
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);
    
    this.center[X] += this.velocity * cosA;
    this.center[Y] += this.velocity * sinA;
    
    // update bullets
    for (let b = 0; b < this.bullets.length; b++) {
        this.bullets[b].update();
    }
};

Player.prototype.draw = function(cvs, ctx) {
    // draw self
    if (!cvs) {
        return;
    } else if (!ctx) {
        ctx = cvs.getContext('2d');
    }
    
    let points = [];
    for (let p = 0; p < this.points.length; p++) {
        let point = this.points[p];
        points.push(rotate(point, this.rotation));
    }
    strokePolygon(ctx, this.color, points, this.center);
    
    // draw bullets
    for (let b = 0; b < this.bullets.length; b++) {
        this.bullets[b].draw(cvs, ctx);
    }
};