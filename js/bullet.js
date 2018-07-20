function Bullet(position) {
    this.center    = position;
    this.color     = '#0ff';
    this.speed     = 0;
    this.direction = 0;
    this.life      = 0;
}

Bullet.prototype.fire = function(speed, direction) {
    this.speed     = speed;
    this.direction = direction;
    this.life      = 0;
};

Bullet.prototype.kill = function() {
    this.life = -1;
};

Bullet.prototype.isAlive = function() {
    return this.life >= 0;
};

Bullet.prototype.update = function() {
    if (this.life < 0) {
        return;
    }
    
    let rad  = degToRad(this.direction);
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);
    this.center[X] += this.speed * cosA;
    this.center[Y] += this.speed * sinA;
    this.life++;
};

Bullet.prototype.draw = function(cvs, ctx) {
    if (this.life < 0) {
        return;
    }
    
    drawPoint(ctx, this.center, this.color);
};