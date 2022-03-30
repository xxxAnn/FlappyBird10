class Setting {
    constructor(scrn, state) {
        this.cog = COGSPRITE 
        this.pause = PAUSESPRITE
        this.gearPos = {
            w: 80,
            h: 80,
            y: 10,
        }
        this.gearPos.x = scrn.width-(this.gearPos.w+10)

        this.turning = false
        this.PAGEON = false
        // --------------
        this.menuPos = {
            w: scrn.width * 0.8,
            radius: 10,
        }
        this.menuPos.h = this.menuPos.w,
        this.menuPos.x = (scrn.width-this.menuPos.w)/2,
        this.menuPos.y = (scrn.height-this.menuPos.h)/2,
        // --------------

        this.mousePos = {x:0, y:0}
        this.hovering = 0
        this.hoveringStates = {
            none: 0,
            gear: 1,
            menu: 2,
        }
        this.menuOpened = false
        this.animationLength = 45 // in frames
        this.animationFrms = 0
        this.rotation = 0
    }
    draw(sctx, state) {
        if (state.curr == state.gameOver) return
        if (state.curr == state.Play) {
            if (this.hovering == this.hoveringStates.gear) {
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
        if (this.hovering == this.hoveringStates.gear && this.animationFrms < 125) { // rotation of 180° changeable
            this.drawRotation(sctx)
            this.rotation = this.animationFrms % 360
            this.animationFrms += 360/this.animationLength
            this.hovered = true
        } else if (this.hovering != this.hoveringStates.gear) {
            this.drawRotation(sctx)
            if (this.hovered && this.animationFrms >= 0) {
                this.rotation = this.animationFrms % 360
                this.animationFrms -= 360/this.animationLength
            }
            // this.hovered = false
        } else {
            this.drawRotation(sctx)
        }
        sctx.restore()
    }
    handleMouseMove(pos, scrn) {
        const gearHover = this.checkButtonHover(pos, this.gearPos, scrn, this.hoveringStates.gear)
        const menuHover = this.checkButtonHover(pos, this.menuPos, scrn, this.hoveringStates.menu) && this.PAGEON
        if (!(gearHover||menuHover)) {
            this.hovering = this.hoveringStates.none
        }
        
        return gearHover
    }
    drawRotation(sctx) {
        const i = 0.5
        sctx.translate(this.gearPos.x+ this.gearPos.w * i, this.gearPos.y+this.gearPos.h * i)
        sctx.rotate(RAD * this.rotation)
        sctx.imageSmoothingEnabled = true;
        sctx.drawImage(this.cog, -this.gearPos.w/2, -this.gearPos.h/2, this.gearPos.w, this.gearPos.h)
        sctx.imageSmoothingEnabled = false;
        sctx.rotate(-RAD * this.rotation)
        sctx.translate(-this.gearPos.x-this.cog.width * i, -this.gearPos.y - this.cog.height * i) 
    }
    openSettings(sctx, scrn) {
        sctx.beginPath()
        sctx.roundRect(this.menuPos.x, this.menuPos.y, this.menuPos.w, this.menuPos.h, [this.menuPos.radius])
        sctx.fillStyle = "grey"
        sctx.fill()
    }
    checkButtonHover(mousePos, buttonPos, scrn, hoveringState) {
        if (mousePos.x < buttonPos.x) return false
        if (mousePos.x > buttonPos.x + buttonPos.w) return false
        if (mousePos.y < buttonPos.y) return false
        if (mousePos.y > buttonPos.y + buttonPos.h) return false

        this.hovering = hoveringState
        return true
    }
}