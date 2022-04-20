let TEST = 100
class PipeSet {
    constructor(scrn, sr) {
        this.halfwidth = scrn.width/2
        this.reset(scrn, sr)
    }
    reset(scrn, sizeRatio) {
        this.bot = BOT
        this.top = TOP
        this.top2 = TOP2
        this.bot2 = BOT2
        this.moved = true
        // should be relative to screen size
        this.gap = PIPE_DEFAULT_GAP*sizeRatio
        this.MINGAP = PIPE_MINIMUM_GAP
        this.FRMTHRESH = PIPE_DEFAULT_THRESH
        this.FRMTHRESH.app = 0
        this.FRMTHRESH.accel = 0
        this.FRMTHRESH.dx = 0
        this.canToggleEvent = PIPE_DEFAULT_CAN_TOGGLE_EVENT
        this.id = 0
        // --
        this.pipes = []
        this.end = false
        this.w
        this.h
    }
    draw(sctx, state) {
       for (let i = 0; i<this.pipes.length; i++) {
           let p = this.pipes[i]
           let tspr = (p.top == 0 ? this.top2 : this.top)
           let bspr = (p.bot == 0 ? this.bot2 : this.bot)
           if (state.curr==state.Play) {
             p.y += (p.x < this.halfwidth*4/3 ? -1 : 1) * Math.random()*3 *(p.d == 1 ? -1 : 1)
           }
           sctx.drawImage(tspr.sprite,p.x,p.y, this.w, this.h)
           sctx.drawImage(bspr.sprite,p.x,p.y+parseFloat(this.h)+p.g, this.w, this.h)
       }
    }
    update(state, scrn, ui, bird) {
        if(state.curr!=state.Play) return
        
        if(frms>this.FRMTHRESH.app && !this.end) {
            let g = 0// Math.max(this.gap-(frms/35), this.MINGAP)
            this.pipes.push({x:parseFloat(scrn.width),
                y:(-(Math.random())*150+scrn.height/2)-this.h,
                g:g,
                d: Math.round(Math.random()),
                bot:Math.round(Math.random()),
                top:Math.round(Math.random())})
            this.FRMTHRESH.app+=(1/(dx*BIRD_ANIMATION_SPEED))
        }
        this.pipes.forEach(pipe=>{
            pipe.x -= dx
        })

        if(this.pipes.length&&this.pipes[0].x < -this.top.sprite.width) {
            this.pipes.shift()
            this.moved = true
        }
        
        if (this.end && this.pipes.length==0) {
            bird.movingToCenter.t = false
            state.gameStage = 1
        }
        
        if (frms>this.FRMTHRESH.accel) {
            dx+=0.1
            this.FRMTHRESH.accel+=1/PIPE_ACCELERATION_RATE
            if (dx>this.FRMTHRESH.dx && dx>PIPE_DEFAULT_MOVESPEED && state.gameStage === this.id) {
                ui.pushMessage("Speed up ↑", 50, 80)
                this.FRMTHRESH.dx+=5
            }
            if (dx>FIRSTEVENTTHRESHOLD && this.canToggleEvent.includes(1)) {
                this.canToggleEvent = this.canToggleEvent.filter((x) => x!=1)
                this.end = true
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
    }

}