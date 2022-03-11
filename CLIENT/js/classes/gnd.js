class GND {
    constructor() {
        this.sprite = new Image()
        this.sprite.src = "img/ground.png"
        this.x = 0
        this.y = 0
    }
    draw(sctx, scrn) {
        this.y = parseFloat(scrn.height-this.sprite.height);
        sctx.drawImage(this.sprite,this.x,this.y);
     }
     update(state) {
        if(state.curr != state.Play) return;
        this.x -= dx;
        this.x = this.x % (this.sprite.width/5);    
    }
}