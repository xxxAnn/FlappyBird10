let TEST = 50
class PipeSet {
    constructor(scrn) {
        this.bot = BOT
        this.top = TOP
        this.fireball = FIREBALLSPRITE
        this.fireballs = []
        this.moved = true
        // should be relative to screen size --
        this.gap = PIPE_DEFAULT_GAP
        this.MINGAP = PIPE_MINIMUM_GAP
        this.FRMTHRESH = PIPE_DEFAULT_THRESH
        this.canToggleEvent = PIPE_DEFAULT_CAN_TOGGLE_EVENT
        this.mode = 0
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
       for (let i = 0; i<this.fireballs.length; i++) {
           let f = this.fireballs[i]
           sctx.drawImage(this.fireball, f.x, f.y, f.w, f.h)
       }
    }
    update(state, scrn, ui, bird) {
        if(state.curr!=state.Play) return
            if (this.mode == 0) {
                if(frms>this.FRMTHRESH.app) {
                let g = Math.max(this.gap-(frms/35), this.MINGAP)
                this.pipes.push({x:parseFloat(scrn.width),y:-210*Math.min(Math.random()+1,1.8),gap:g})
                this.FRMTHRESH.app+=(1/(dx*BIRD_ANIMATION_SPEED))
                }
            }
            this.pipes.forEach(pipe=>{
                pipe.x -= dx
            })

            if(this.pipes.length&&this.pipes[0].x < -this.top.sprite.width) {
            this.pipes.shift()
            this.moved = true
            }
            if (this.mode == 1 && this.pipes.length == 0) {
                this.mode = 2
                dx = PIPE_DEFAULT_MOVESPEED
                this.FRMTHRESH.dx = PIPE_DEFAULT_MOVESPEED+5
                bird.goToCenter(250) 
                ui.pushMessage("!!", 50, 0, 0, 80, "red", false)
                ui.pushMessage("WATCH OUT", 150, 120)
                this.FRMTHRESH.fb = frms+(1/FIREBALL_SPAWNRATE)
            }
            if (this.mode == 2) {
                if (frms>this.FRMTHRESH.fb) {
                    this.newFireball(Math.floor(Math.random() * (scrn.width/3))+scrn.width/3, 10, TEST*RAD, FIREBALL_SIZE)
                    this.FRMTHRESH.fb = frms+(1/FIREBALL_SPAWNRATE)
                }

                this.fireballs.forEach(fb => {
                    fb.y+=dx*FIREBALL_MOVEMENTSPEED
                    fb.x-=dx*fb.rg
                    if (fb.y>=scrn.height) {
                        fb.die = true
                        ui.curr+=1
                    }
                })
            }
            this.fireballs = this.fireballs.filter((x) => !x.die)
        
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
    newFireball(x, y, rot, size=50) {
        this.fireballs.push({
            x: x,
            y: y,
            h: size,
            w: size,
            rot: rot,
            die: false,
            rg: Math.floor(Math.random()*3-1.5)
        })
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