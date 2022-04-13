// this will be the class where we do the arrows

class Arrows {
    constructor(scrn) {
        this.w = 75
        this.margin = 5
        
        this.right = {
            sprite: ARROW_RIGHT,
            x:scrn.width-(this.margin+this.w),
            y:scrn.height-(this.margin+this.w),
        }
        this.up = {
            sprite: ARROW_UP,
            x:this.right.x-this.w-this.margin,
            y:scrn.height-(this.margin+this.w),
        }
        this.left = {
            sprite: ARROW_LEFT,
            x:this.up.x-this.w-this.margin,
            y:scrn.height-(this.margin+this.w),
        }
        this.hovering = 0
        this.hoveringStates = {
            none: 0,
            left: 1,
            up: 2,
            right: 3,
        }
    }
    draw(sctx) {
        sctx.fillStyle = `hsl(0, 0%, 50%, 0.5)`
        sctx.fillRect(this.right.x, this.right.y, this.w, this.w)
        sctx.fillRect(this.up.x, this.up.y, this.w, this.w)
        sctx.fillRect(this.left.x, this.left.y, this.w, this.w)

        sctx.drawImage(this.right.sprite, this.right.x, this.right.y, this.w, this.w)
        sctx.drawImage(this.up.sprite, this.up.x, this.up.y, this.w, this.w)
        sctx.drawImage(this.left.sprite, this.left.x, this.left.y, this.w, this.w)
    }
    handleMouseMove(pos) {
        const leftPos = {x:this.left.x, y:this.left.y, w:this.w, h:this.w}
        const leftHover = checkButtonHover(pos, leftPos, this.hoveringStates.left, this)

        const rightPos = {x:this.right.x, y:this.right.y, w:this.w, h:this.w}
        const rightHover = checkButtonHover(pos, rightPos, this.hoveringStates.right, this) 

        const upPos = {x:this.up.x, y:this.up.y, w:this.w, h:this.w}
        const upHover = checkButtonHover(pos, upPos, this.hoveringStates.up, this) 

        if (!(leftHover||rightHover||upHover)) {
            this.hovering = this.hoveringStates.none
        }
        
        return leftHover||rightHover||upHover
    }
}