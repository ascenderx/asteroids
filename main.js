window.addEventListener('load', function() {
    let cvs = gel('cvs');
    let ctx = cvs.getContext('2d');
    let fps = 60;
    this.game = new Game(cvs, ctx, 30);
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