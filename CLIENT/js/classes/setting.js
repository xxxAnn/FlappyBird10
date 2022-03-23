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
        this.hovering = false
        this.animationLength = 45 // in frames
        this.animationFrms = 0
        this.rotation = 0
        this.hovered = false
        this.wait = false
    }
    draw(sctx, state) {
        // if (state.curr == state.gameOver) return
        // sctx.save()
        // if (this.hovered === true && !this.turning) {
        //     this.turning = true
        //     let f = 0.9
        //     this.h = this.h*f
        //     this.w = this.w*f
        //     let org_x = this.x
        //     let org_y = this.y
        //     this.y += (this.h/f-this.h)/2
        //     this.x += (this.w/f-this.w)/2
        //     setTimeout(() => {
        //         this.turning = false
        //         this.h = this.h/f
        //         this.w = this.w/f
        //         this.x = org_x
        //         this.y = org_y
        //     }, 250);
        // }
        // if (state.curr == state.getReady) {
        //     sctx.drawImage(this.cog, this.x, this.y, this.w, this.h)
        // } else if (state.curr == state.Play) {
        //     sctx.drawImage(this.pause, this.x, this.y, this.w, this.h)
        // }
        
        // sctx.restore()

        if (state.curr == state.gameOver) return
        if (state.curr == state.Play) {
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
            sctx.drawImage(this.pause, this.x, this.y, this.w, this.h)
            return
        }

        sctx.save()
        if (this.hovering === true && this.animationFrms < 125) { // rotation of 180° changeable
            this.drawRotation(sctx)
            this.rotation = this.animationFrms % 360
            this.animationFrms += 360/this.animationLength
            this.hovered = true
        } else if (this.hovering === false) {
            this.drawRotation(sctx)
            if (this.hovered === true && this.animationFrms >= 0) {
                this.rotation = this.animationFrms % 360
                this.animationFrms -= 360/this.animationLength
            }
        } else {
            this.drawRotation(sctx)
        }
        sctx.restore()
    }
    handleMouseMove(pos, scrn) {
        this.mousePos = pos
        scrn.style.cursor = 'default'
        if (this.mousePos.x < this.x) return false
        if (this.mousePos.x > this.x + this.w) return false
        if (this.mousePos.y < this.y) return false 
        if (this.mousePos.y > this.y + this.h) return false
        
        scrn.style.cursor = 'pointer'
        return true
    }
    drawRotation(sctx) {
        const i = 0.5
        sctx.translate(this.x+ this.w * i, this.y+this.h * i)
        sctx.rotate(RAD * this.rotation)
        sctx.drawImage(this.cog, -this.w/2, -this.h/2, this.w, this.h)
        sctx.rotate(-RAD * this.rotation)
        sctx.translate(-this.x-this.cog.width * i,-this.y -this.cog.height * i) 
    }
    openSettings(sctx, scrn) {
        sctx.beginPath()
        let w = 400
        let h = 400
        sctx.roundRect((scrn.width-w)/2,scrn.height/3,w,h,[10])
        sctx.fillStyle = "grey"
        sctx.fill()
    }
}