class Setting {
    constructor(scrn, state) {
        this.cog = COGSPRITE 
        this.pause = PAUSESPRITE
        this.gearPos = {
            w: 80,
            h: 80,
            y: 10,
            x: scrn.width-(this.w+10),
        }
        this.turning = false
        this.PAGEON = false

        this.mousePos = {x:0, y:0}
        this.hovering = 0
        this.hoveringPos = {
            none: 0,
            gear: 1,
            menu: 2,
            menuOpened: 3,
        }
        this.animationLength = 45 // in frames
        this.animationFrms = 0
        this.rotation = 0
        this.wait = false
    }
    draw(sctx, state) {
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
        return checkButtonHover(pos, this.gearPos,scrn)
    }
    drawRotation(sctx) {
        const i = 0.5
        sctx.translate(this.x+ this.w * i, this.y+this.h * i)
        sctx.rotate(RAD * this.rotation)
        sctx.imageSmoothingEnabled = true;
        sctx.drawImage(this.cog, -this.w/2, -this.h/2, this.w, this.h)
        sctx.imageSmoothingEnabled = false;
        sctx.rotate(-RAD * this.rotation)
        sctx.translate(-this.x-this.cog.width * i,-this.y -this.cog.height * i) 
    }
    openSettings(sctx, scrn) {
        sctx.beginPath()
        let w = scrn.width * 0.8
        let h = w
        sctx.roundRect((scrn.width-w)/2,(scrn.height-h)/2,w,h,[10])
        sctx.fillStyle = "grey"
        sctx.fill()
    }
}

function checkButtonHover(mousePos, buttonPos, scrn) {
    scrn.style.cursor = 'default'
    if (mousePos.x < buttonPos.x) return false
    if (mousePos.x > buttonPos.x + buttonPos.w) return false
    if (mousePos.y < buttonPos.y) return false 
    if (mousePos.y > buttonPos.y + buttonPos.h) return false
    
    scrn.style.cursor = 'pointer'
    return true
}