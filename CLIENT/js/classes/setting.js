class Setting {
    constructor(scrn, state, sfx) {
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
            h: 10,
            radius: 10,
            current: MENU_OPEN_LENGTH,
        }
        this.menuPos.x = (scrn.width-this.menuPos.w)/2
        this.menuPos.y = (scrn.height-this.menuPos.h)/2
        // --------------
        this.buttons = [1,2]
        // --------------
        this.volSlider = {
            bar_x: this.menuPos.x+this.menuPos.w*0.2,
            bar_y: this.menuPos.y+(this.menuPos.w/this.buttons.length+2) + 2.5,
            bar_w: this.menuPos.w*0.6,
            bar_h: 5,
            radius: 10,
        }
        this.volSlider.btn_x = this.volSlider.bar_x+sfx.VOLUME*this.volSlider.bar_w
        this.moving = false
        // --------------
        
        this.mousePos = {x:0, y:0}
        this.hovering = 0
        this.hoveringStates = {
            none: 0,
            gear: 1,
            menu: 2,
            vol: 3,
            volBar: 4,
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
        const gearHover = this.checkButtonHover(pos, this.gearPos, this.hoveringStates.gear)
        const menuHover = this.checkButtonHover(pos, this.menuPos, this.hoveringStates.menu) && this.PAGEON

        const volBarPos = {x: this.volSlider.bar_x, y: this.volSlider.bar_y - this.volSlider.radius, w: this.volSlider.bar_w, h: this.volSlider.radius*2}
        const volumeBar = this.checkButtonHover(pos, volBarPos, this.hoveringStates.volBar) && this.PAGEON

        const posVol = {x: this.volSlider.btn_x-this.volSlider.radius, y: this.volSlider.bar_y+this.volSlider.bar_h/2-this.volSlider.radius, w:this.volSlider.radius*2, h:this.volSlider.radius*2}
        const volumeHover = this.checkButtonHover(pos, posVol, this.hoveringStates.vol) && this.PAGEON

        if (!(gearHover||menuHover||volumeHover||volumeBar)) {
            this.hovering = this.hoveringStates.none
        }
        
        return gearHover||volumeHover||volumeBar
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
    openSettings(sctx, scrn, sfx) {
        sctx.beginPath()
        sctx.roundRect(this.menuPos.x, this.menuPos.y, this.menuPos.w, this.menuPos.h, [this.menuPos.radius])
        sctx.fillStyle = "grey"
        sctx.fill()
        if (this.PAGEON) {
            if (this.menuPos.current > 0) {
                this.menuPos.h = easeInOut(this.menuPos.current/MENU_OPEN_LENGTH)*this.menuPos.w
                this.menuPos.current--
                
                this.menuPos.y = (scrn.height-this.menuPos.h)/2
                return
            }
            this.drawButtons(sctx, sfx)
            return
        }
        // else :
        this.menuPos.h = easeInOut(this.menuPos.current/MENU_OPEN_LENGTH)*this.menuPos.w
        this.menuPos.current++
        
        this.menuPos.y = (scrn.height-this.menuPos.h)/2
        return 
    }
    checkButtonHover(mousePos, buttonPos, hoveringState) {
        if (mousePos.x < buttonPos.x) return false
        if (mousePos.x > buttonPos.x + buttonPos.w) return false
        if (mousePos.y < buttonPos.y) return false
        if (mousePos.y > buttonPos.y + buttonPos.h) return false

        this.hovering = hoveringState
        return true
    }
    drawButtons(sctx, sfx) {
        this.volSlider.bar_y = this.menuPos.y+(this.menuPos.w/(this.buttons.length+2)) + 2.5
        sctx.beginPath()
        sctx.fillStyle = '#000'
        sctx.lineWidth = "2"
        sctx.font = "40px Squada One"

        sctx.fillText(`Volume         ${(sfx.VOLUME*100).toFixed(0)}`, this.volSlider.bar_x, this.volSlider.bar_y-15)
        sctx.roundRect(this.volSlider.bar_x, this.volSlider.bar_y, this.volSlider.bar_w, this.volSlider.bar_h, [10])
        sctx.fill()
        sctx.arc(this.volSlider.btn_x, this.volSlider.bar_y+this.volSlider.bar_h/2, this.volSlider.radius, 0, 2*Math.PI, false)
        sctx.fill()
    }
    changeVolume(mousePos, sfx) {
        this.volSlider.btn_x = Math.max(Math.min(mousePos.x, this.volSlider.bar_x+this.volSlider.bar_w), this.volSlider.bar_x)
        sfx.VOLUME = (this.volSlider.btn_x-this.volSlider.bar_x)/this.volSlider.bar_w
        localStorage.setItem("FB10VOLUME", sfx.VOLUME)

        sfx.start.volume = sfx.VOLUME
        sfx.flap.volume = sfx.VOLUME
        sfx.score.volume = sfx.VOLUME
        sfx.hit.volume = sfx.VOLUME
        sfx.die.volume = sfx.VOLUME
        sfx.bgm.volume = sfx.VOLUME
    }
}

function easeInOut(t) {
    const x0 = 1
    const y0 = 1
    const x1 = 1
    const y1 = 0
    const x2 = 0
    const y2 = 1
    const x3 = 0
    const y3 = 0
    const i = {
        x: (1-t)*((1-t)*((1-t)*x0+t*x1)+t*((1-t)*x1+t*x2))+t*((1-t)*((1-t)*x1+t*x2)+t*((1-t)*x2+t*x3)),
        y: (1-t)*((1-t)*((1-t)*y0+t*y1)+t*((1-t)*y1+t*y2))+t*((1-t)*((1-t)*y1+t*y2)+t*((1-t)*y2+t*y3))
    }
    return i.x
};