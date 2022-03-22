function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
}

class Setting {
    constructor(scrn, state) {
        this.sprite = COGSPRITE 
        this.w = 80
        this.h = 80
        this.y = 20
        this.x = scrn.width-(this.w+10)
        // this.PAGEON = false
        // let TELEPORT = {
        //     x: this.x,
        //     y: this.y,
        //     h: this.h,
        //     w: this.w
        // }
        // let o = this
        // scrn.onclick = function(ev) {
        //     let newev = getMousePos(scrn,ev)
        //     let x = newev.x
        //     let y = newev.y
        //     console.log(x, TELEPORT.x, TELEPORT.w)
        //     console.log(y, TELEPORT.y, TELEPORT.h)
        //     if (((x >= TELEPORT.x) && (x <= TELEPORT.x+TELEPORT.w)) && ((y >= TELEPORT.y) && (y <= TELEPORT.y+TELEPORT.h))) {
        //         if (state.curr == state.getReady) {
        //             o.PAGEON = !o.PAGEON
        //         }
        //     } else {
        //         f()
        //     }
        // }
        this.mousePos = {x:0, y:0}
        this.hovered = false;
    }
    draw(sctx, state) {
        if (state.curr !== state.getReady) return
        sctx.drawImage(this.sprite, this.x, this.y, this.w, this.h)
    }
    update(sctx, state) {
        if (state.curr !== state.getReady) return
        const animationLength = 60;
        if (this.hovered === true) {
            console.log('>>')
            sctx.save()
            sctx.translate(this.sprite.width * 0.5, this.sprite.height * 0.5) 
            sctx.rotate(2*Math.PI/animationLength)
            sctx.translate(-this.sprite.width * 0.5, -this.sprite.height * 0.5)
            this.draw(sctx)
            sctx.restore()
        }
    }
    handleMouseMove(pos) {
        this.mousePos = pos
        if (this.mousePos.x < this.x) return
        if (this.mousePos.x > this.x + this.w) return
        if (this.mousePos.y < this.y) return
        if (this.mousePos.y > this.y + this.h) return
        
        return true
    }
}