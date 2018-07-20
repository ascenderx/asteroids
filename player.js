function Player(center, cvs, ctx) {
    this.center    = center;
    this.cvs       = cvs;
    this.ctx       = ctx;
    this.color     = '#f00';
    this.rotation  = 0;
    this.direction = 0;
    this.velocity  = 0;
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

Player.prototype.update = function() {
    let rad  = degToRad(this.direction);
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);
    
    this.center[X] += this.velocity * cosA;
    this.center[Y] += this.velocity * sinA;
};

Player.prototype.draw = function() {
    if (!this.cvs) {
        return;
    } else if (!this.ctx) {
        this.ctx = this.cvs.getContext('2d');
    }
    
    let points = [];
    for (let p = 0; p < this.points.length; p++) {
        let point = this.points[p];
        points.push(rotate(point, this.rotation));
    }
    strokePolygon(this.ctx, this.color, points, this.center);
};