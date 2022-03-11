class Background {
    constructor(scrn) {
        this.sprite = new Image(400)
        this.sprite.src = "img/BG.png"
        this.x = 0
        this.y = 0
        this.height = 330,
        this.width = scrn.width
    }
    draw(scrn, sctx) {
        let y = parseFloat(scrn.height-this.height);
        sctx.drawImage(this.sprite,this.x,y,this.width,this.height);
    }
}