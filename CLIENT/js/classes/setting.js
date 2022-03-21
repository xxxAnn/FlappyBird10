function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
}

class Setting {
    constructor(scrn) {
        this.sprite = COGSPRITE 
        this.w = 30
        this.h = 30
        this.y = this.h+10
        this.x = scrn.width-(this.w+10)
        let TELEPORT = {
            x: this.x,
            y: this.y,
            h: this.h,
            w: this.w
        }
        scrn.onclick = function(ev) {
            let newev = getMousePos(scrn,ev)
            let x = newev.x
            let y = newev.y
            console.log(x, TELEPORT.x, TELEPORT.w)
            console.log(y, TELEPORT.y, TELEPORT.h)
            if (((x >= TELEPORT.x) && (x <= TELEPORT.x+TELEPORT.w)) && ((y >= TELEPORT.y) && (y <= TELEPORT.y+TELEPORT.h))) {
                alert("CLICKED THE BUTTON")
            }
        }
    }
    draw(sctx) {
        sctx.drawImage(this.sprite, this.x, this.y, this.w, this.h)
    }
}