window.addEventListener('load', function() {
    let cvs = gel('cvs');
    let ctx = cvs.getContext('2d');
    let fps = 30;
    
    let lblScore      = gel('lblScore');
    let lblPositionX  = gel('lblPositionX');
    let lblPositionY  = gel('lblPositionY');
    let lblPositionNX = gel('lblPositionNX');
    let lblPositionNY = gel('lblPositionNY');
    let lblSpeedDR    = gel('lblSpeedDR');
    let lblSpeedDX    = gel('lblSpeedDX');
    let lblSpeedDY    = gel('lblSpeedDY');
    let lblRotation   = gel('lblRotation');
    let lblDirection  = gel('lblDirection');
    
    this.game = new Game(cvs, ctx, fps);
    this.game.addCallback(function updateHTML(game) {
        lblScore.innerText = game.score;
        
        let player = game.player;
        lblPositionX.innerText  = round(player.center[X]);
        lblPositionY.innerText  = round(player.center[Y]);
        
        let width  = game.edges.right  - game.edges.left;
        let height = game.edges.bottom - game.edges.top;
        lblPositionNX.innerText = round(width  / 2 - player.center[X]);
        lblPositionNY.innerText = round(height / 2 - player.center[Y]);
        lblSpeedDR.innerText    = round(player.velocity,   1);
        lblDirection.innerText  = round(-player.direction, 1);
        lblRotation.innerText   = round(-player.rotation,  1);
        
        let rad = degToRad(player.direction);
        lblSpeedDX.innerText   = round(player.velocity * Math.cos(rad), 1);
        lblSpeedDY.innerText   = round(player.velocity * Math.sin(rad), 1);
    });
    this.game.run();
});

window.addEventListener('keydown', function(event) {
    if (!this.game) {
        return;
    }
    
    this.game.fireKey(event.code);
});

window.addEventListener('keyup', function(event) {
    if (!this.game) {
        return;
    }
    
    this.game.releaseKey(event.code);
});