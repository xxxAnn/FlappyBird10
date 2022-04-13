// this will be the class where we do the arrows

class Arrows {
    constructor(scrn) {
        this.width = 10
        this.margin = 5
        this.left = {
            x:scrn.width-(this.margin+this.width),
            y:scrn.height-(this.margin+this.width),
        }
        this.right = {
            x:scrn.width-(this.margin+this.width),
            y:scrn.height-(this.margin+this.width),
        }
        this.up = {
            x:scrn.width-(this.margin+this.width),
            y:scrn.height-(this.margin+this.width),
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
        
    }
    handleMouseMove(pos) {
        const leftPos = {x:this.left.x, h:this.left.h, w:this.width, h:this.width}
        const leftHover = checkButtonHover(pos, leftPos, this.hoveringStates.left, this)

        const rightPos = {x:this.right.x, h:this.right.h, w:this.width, h:this.width}
        const rightHover = checkButtonHover(pos, rightPos, this.hoveringStates.right, this) 

        const upPos = {x:this.up.x, h:this.up.h, w:this.width, h:this.width}
        const upHover = checkButtonHover(pos, upPos, this.hoveringStates.up, this) 

        if (!(leftHover||rightHover||upHover)) {
            this.hovering = this.hoveringStates.none
        }
        
        return leftHover||rightHover||upHover
    }
}