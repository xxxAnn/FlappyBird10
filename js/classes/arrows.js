// this will be the class where we do the arrows

class Arrows {
    constructor(scrn) {
        this.w = 75
        this.margin = 5
        
        this.right = {
            sprite: ARROW_RIGHT,
            x:scrn.width-(this.margin+this.w),
            y:scrn.height-(this.margin+this.w),
            id:1,
            active:false,
        }
        this.up = {
            sprite: ARROW_UP,
            x:this.right.x-this.w-this.margin,
            y:scrn.height-(this.margin+this.w),
            id:2,
            active:false,
        }
        this.left = {
            sprite: ARROW_LEFT,
            x:this.up.x-this.w-this.margin,
            y:scrn.height-(this.margin+this.w),
            id:3,
            active:false,
        }
        this.buttons = [this.right, this.left, this.up]

        this.hovering = 0
        this.hoveringStates = {
            none: 0,
            right: 1,
            up: 2,
            left: 3,
        }
    }
    draw(sctx) {
        sctx.save()
        this.buttons.forEach(b => {
           sctx.fillStyle = `hsl(0, 0%, 0%, ${b.active ? 0.6: 0.3})`
           sctx.fillRect(b.x, b.y, this.w, this.w) 
           sctx.drawImage(b.sprite, b.x, b.y, this.w, this.w)
        })
        sctx.restore()
    }
    handleMouseMove(pos) {
        var hover = 0;
        this.buttons.forEach(b => {
            const bPos = {x:b.x, y:b.y, w:this.w, h:this.w} 
            var res = checkButtonHover(pos, bPos, b.id, this)
            if (res) hover += 1
        })

        if (hover <= 0) {
            this.hovering = this.hoveringStates.none
        }
        
        return hover > 0 ? true: false;
    }
    handleClick(bird, sctx) {
        var side = false
        this.buttons.forEach(b => {
            if (this.hovering === b.id) {
                b.active = true
                if (b.id !== this.hoveringStates.up) {
                    bird.dash(-(b.id-2), sctx)
                    side = true
                }
            }
        })
        return side
    }
}