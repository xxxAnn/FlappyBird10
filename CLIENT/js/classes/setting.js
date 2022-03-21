function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
}

class Setting {
    constructor(scrn, state, f) {
        this.sprite = COGSPRITE 
        this.w = 80
        this.h = 80
        this.y = 20
        this.x = scrn.width-(this.w+10)
        this.PAGEON = false
        let TELEPORT = {
            x: this.x,
            y: this.y,
            h: this.h,
            w: this.w
        }
        let o = this
        scrn.onclick = function(ev) {
            let newev = getMousePos(scrn,ev)
            let x = newev.x
            let y = newev.y
            console.log(x, TELEPORT.x, TELEPORT.w)
            console.log(y, TELEPORT.y, TELEPORT.h)
            if (((x >= TELEPORT.x) && (x <= TELEPORT.x+TELEPORT.w)) && ((y >= TELEPORT.y) && (y <= TELEPORT.y+TELEPORT.h))) {
                if (state.curr == state.getReady) {
                    o.PAGEON = !o.PAGEON
                }
            } else {
                f()
            }
        }
    }
    draw(sctx, state) {
        if (state.curr == state.getReady) {
            sctx.drawImage(this.sprite, this.x, this.y, this.w, this.h)
        }
    }
}