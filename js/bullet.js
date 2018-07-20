function Bullet(position) {
    this.position  = position.slice();
    this.color     = '#0ff';
    this.speed     = 0;
    this.direction = 0;
}

Bullet.prototype.fire = function(speed, direction) {
    this.speed     = speed;
    this.direction = direction;
};

Bullet.prototype.update = function() {
    let rad  = degToRad(this.direction);
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);
    this.position[X] += this.speed * cosA;
    this.position[Y] += this.speed * sinA;
};

Bullet.prototype.draw = function(cvs, ctx) {
    drawPoint(ctx, this.position, this.color);
};