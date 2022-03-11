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
        this.times = Math.ceil(scrn.width/this.sprite.width)+1;
        for (let i = 0; i < this.times; i++) {
          let variation = i>0?-6:0;
          let deviation = this.sprite.width*i + variation*i;
          this.y = parseFloat(scrn.height-this.sprite.height);
          sctx.drawImage(this.sprite,this.x+deviation,this.y, this.sprite.width, this.sprite.height);
        }
      }
     update(state) {
        if(state.curr != state.Play) return;
        this.x -= dx;
        this.x = this.x % (this.sprite.width/4);
    }
}