function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
}

class Setting {
    constructor(scrn, state) {
        this.cog = COGSPRITE 
        this.pause = PAUSESPRITE
        this.w = 80
        this.h = 80
        this.y = 20
        this.x = scrn.width-(this.w+10)
        this.turning = false
        this.PAGEON = false
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
        if (state.curr == state.gameOver) return
        sctx.save()
        if (this.hovered === true && !this.turning) {
            this.turning = true
            let f = 0.9
            this.h = this.h*f
            this.w = this.w*f
            let org_x = this.x
            let org_y = this.y
            this.y += (this.h/f-this.h)/2
            this.x += (this.w/f-this.w)/2
            setTimeout(() => {
                this.turning = false
                this.h = this.h/f
                this.w = this.w/f
                this.x = org_x
                this.y = org_y
            }, 250);
        }
        if (state.curr == state.getReady) {
            sctx.drawImage(this.cog, this.x, this.y, this.w, this.h)
        } else if (state.curr == state.Play) {
            sctx.drawImage(this.pause, this.x, this.y, this.w, this.h)
        }
        
        sctx.restore()
    }
    update(sctx, state) {
        if (state.curr !== state.getReady) return
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