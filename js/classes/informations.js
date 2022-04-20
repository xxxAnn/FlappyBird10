class Info {
    constructor(scrn) {
        this.sprite = INFOSPRITE
        this.iconPos = {
            w: 75,
            h: 75,
            y: 15,
            x: 15,
            current: 0,
            length: 60,
        }

        this.hovering = 0
        this.hoveringStates = {
            none: 0,
            icon: 1,
        }
        this.PAGEON = false
        this.menuPos = {
            w: scrn.width * 0.8,
            h: 0,
            radius: 10,
            current: 0,
        }
        this.menuPos.x = (scrn.width-this.menuPos.w)/2
        this.menuPos.y = (scrn.height-this.menuPos.h)/2
        this.currentColor = 158
    }
    draw(sctx) {
        sctx.beginPath()
        sctx.fillStyle = `hsl(${this.currentColor}, 100%, 50%, 0.7)`
        sctx.arc(this.iconPos.x+this.iconPos.w/2, this.iconPos.y+this.iconPos.h/2, this.iconPos.w/2, 0, 2*Math.PI, false)
        sctx.fill()
        if (this.hovering == this.hoveringStates.icon) {
            
            this.currentColor = 158 + (easeInOut(this.iconPos.current/this.iconPos.length)*((322-158)-(175-280))) // remove 175-280
            if (this.iconPos.current < this.iconPos.length) {
                this.iconPos.current++
            }
            sctx.fillStyle = "#30c0df"
            sctx.closePath()
        } else {
            this.iconPos.current = 0
            this.currentColor= 158
        }
        sctx.drawImage(this.sprite, this.iconPos.x, this.iconPos.y, this.iconPos.w, this.iconPos.h)
    }
    openInfo(sctx, scrn) {
        sctx.beginPath()
        sctx.roundRect(this.menuPos.x, this.menuPos.y, this.menuPos.w, this.menuPos.h, [this.menuPos.radius])
        sctx.fillStyle = "grey"
        sctx.fill()
        sctx.closePath()

        if (this.menuPos.current <= MENU_OPEN_LENGTH) {
            this.menuPos.h = easeInOut(this.menuPos.current/MENU_OPEN_LENGTH)* scrn.width * 0.8
            this.menuPos.current++
            
            this.menuPos.y = (scrn.height-this.menuPos.h)/2
            return
        }
        if (this.PAGEON) return
        this.menuPos.h = 0
    }
    handleMouseMove(pos) {
        const infoHover = checkButtonHover(pos, this.iconPos, this.hoveringStates.icon, this)

        if (!(infoHover)) {
            this.hovering = this.hoveringStates.none
        }
        
        return infoHover
    }
}