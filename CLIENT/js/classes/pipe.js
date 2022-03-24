let TEST = 50
class PipeSet {
    constructor(scrn) {
        this.bot = BOT
        this.top = TOP
        this.moved = true
        // should be relative to screen size
        this.gap = PIPE_DEFAULT_GAP
        this.MINGAP = PIPE_MINIMUM_GAP
        this.FRMTHRESH = PIPE_DEFAULT_THRESH
        this.canToggleEvent = PIPE_DEFAULT_CAN_TOGGLE_EVENT
        this.id = 0
        // --
        this.pipes = []
        this.w
        this.h
    }
    draw(sctx) {
       for (let i = 0; i<this.pipes.length; i++) {
           let p = this.pipes[i]
           sctx.drawImage(this.top.sprite,p.x,p.y, this.w, this.h)
           sctx.drawImage(this.bot.sprite,p.x,p.y+parseFloat(this.h)+p.gap, this.w, this.h)
       }
    }
    update(state, scrn, ui, bird) {
        if(state.curr!=state.Play) return
        
        if(frms>this.FRMTHRESH.app) {
            let g = Math.max(this.gap-(frms/35), this.MINGAP)
            this.pipes.push({x:parseFloat(scrn.width),y:-210*Math.min(Math.random()+1,1.8),gap:g})
            this.FRMTHRESH.app+=(1/(dx*BIRD_ANIMATION_SPEED))
        }
        this.pipes.forEach(pipe=>{
            pipe.x -= dx
        })

        if(this.pipes.length&&this.pipes[0].x < -this.top.sprite.width) {
        this.pipes.shift()
        this.moved = true
        }
        
        
        if (frms>this.FRMTHRESH.accel) {
            dx+=0.1
            this.FRMTHRESH.accel+=1/PIPE_ACCELERATION_RATE
            if (dx>this.FRMTHRESH.dx && dx>PIPE_DEFAULT_MOVESPEED && this.mode == 0) {
                ui.pushMessage("Speed up ↑", 50, 80)
                this.FRMTHRESH.dx+=5
            }
            if (dx>FIRSTEVENTTHRESHOLD && this.canToggleEvent.includes(1)) {
                this.mode = 1
                this.canToggleEvent = this.canToggleEvent.filter((x) => x!=1)
            }
        }

    }
    sizeChange(sizeRatio) {
        const ratio = 1
        this.top.sprite.height *= (sizeRatio/ratio)
        this.top.sprite.width *= (sizeRatio/ratio)
        this.bot.sprite.height *= (sizeRatio/ratio)
        this.bot.sprite.width *= (sizeRatio/ratio)
        this.w = this.top.sprite.width
        this.h = this.top.sprite.height
        this.gap *= (sizeRatio/ratio)
    }

}