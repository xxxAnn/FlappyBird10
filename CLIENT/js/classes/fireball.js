class FireballSet {
    constructor() {
        this.reset()
    }
    reset() {
        this.fireball = FIREBALLSPRITE
        this.fireballs = []
        this.started = false
        this.id = 1
        this.FRMTHRESH = PIPE_DEFAULT_THRESH
        this.FRMTHRESH.fb = 0
        this.FRMTHRESH.dx = 0
    }
    draw(sctx) {
        for (let i = 0; i<this.fireballs.length; i++) {
            let f = this.fireballs[i]
            sctx.drawImage(this.fireball, f.x, f.y, f.w, f.h)
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
    update(scrn, ui, bird, games, state) {
        if (state.curr !== state.Play) return
        if (games.pipe.pipes.length == 0 && !this.started) {
            dx = PIPE_DEFAULT_MOVESPEED
            this.FRMTHRESH.dx = PIPE_DEFAULT_MOVESPEED+5
            bird.goToCenter(250)
            ui.pushMessage("!!", 50, 0, 0, 80, "red", false)
            ui.pushMessage("WATCH OUT", 150, 120)
            this.FRMTHRESH.fb = frms+(1/FIREBALL_SPAWNRATE)
            this.started = true
        }

        if (frms>this.FRMTHRESH.fb) {
                this.newFireball(/*Math.floor(Math.random() * (scrn.width/3))+scrn.width/3*/ scrn.width/2, 10, TEST*RAD, FIREBALL_SIZE)
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
        this.fireballs = this.fireballs.filter((x) => !x.die) 
    }
}