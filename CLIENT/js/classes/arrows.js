// this will be the class where we do the arrows

class Arrows {
    constructor() {
        this.width = 10
        this.left = {
            x,
            y,
        }
        this.right = {
            x,
            y,
        }
        this.up = {
            x,
            y,
        }
        this.hovering = 0
        this.hoveringStates = {
            none: 0,
            left: 1,
            up: 2,
            right: 3,
        }
    }
    handleMouseMouve(pos) {
        const leftHover = checkButtonHover(pos, this.left, this.hoveringStates.left, this)
        const rightHover = checkButtonHover(pos, this.right, this.hoveringStates.right, this) 
        const upHover = checkButtonHover(pos, this.up, this.hoveringStates.up, this) 

        if (!(leftHover||rightHover||upHover)) {
            this.hovering = this.hoveringStates.none
        }
        
        return leftHover||rightHover||upHover
    }
}