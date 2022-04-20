class Background {
    constructor(scrn) {
        this.sprite = BGSPRITE
        this.x = 0
        this.y = 0
    }
    draw(scrn, sctx) {
      this.times = Math.ceil(scrn.width/this.sprite.width)+1
      
      for (let i = 0; i < this.times; i++) {
          let deviation = this.sprite.width*i
          this.y = parseFloat(scrn.height-this.sprite.height)
          sctx.drawImage(this.sprite,this.x+deviation, this.y, this.sprite.width, this.sprite.height)
      }
    }
    update(state) {
        if(state.curr != state.Play) return
        this.x -= 1
        this.x = this.x % (this.sprite.width)
    }
    sizeChange(sizeRatio) {
        this.sprite.height *= sizeRatio
        this.sprite.width *= sizeRatio
    } 
}