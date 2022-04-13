class Bird {
    constructor() {
        this.reset()
    }
    reset() {
        this.animations = BIRDANIMS
        this.rotatation = BIRD_DEFAULTS.rotatation
        this.x = BIRD_DEFAULTS.x
        this.y = BIRD_DEFAULTS.y
        this.movingToCenter = {
            t: false,
            fr: 0,
            rn: 0
        }
        this.speed = BIRD_DEFAULTS.speed
        this.gravity = BIRD_DEFAULTS.gravity
        this.thrust = BIRD_DEFAULTS.thrust
        this.frame = BIRD_DEFAULTS.frame
        this.immune = false
        this.shadows = []
        this.dashing = {
            t: false,
            curr: 0,
            length: DASHLENGTH,
            dist: DASHDISTANCE,
            orgpos: {
                x: 3,
                y: 4,
                actfrm: 0,
                rot: 0
            },
            dir: 1,
            CD: 0
        }
        this.dashing.t = false
    }
    dash(dir=1, sctx, dive=false) {
        if (this.dashing.CD > 0) return
        this.dashing.t = true
        this.dashing.curr = 0
        this.dashing.orgpos.x = this.x
        this.dashing.orgpos.y = this.y
        this.dashing.orgpos.actfrm = this.frame
        this.dashing.orgpos.rot = this.rotatation
        this.dashing.dir = dir
        this.dashing.dive = dive
        this.movingToCenter.t = false
        if ((this.x<0.1*sctx.canvas.clientWidth && dir == -1) || (this.x > 0.9*sctx.canvas.clientWidth && dir == 1)) {
            this.dashing.t = false
        } else {
            //this.immune = true
        }
    } 
    drawShadows(sctx) {
        this.shadows.forEach(shadow => {
            let posx = shadow.x
            let posy = shadow.y
            let h = this.animations[this.dashing.orgpos.actfrm].sprite.height
            let w = this.animations[this.dashing.orgpos.actfrm].sprite.width
            sctx.save()
            sctx.globalAlpha = 0.25
            sctx.translate(posx,posy)
            sctx.rotate(this.dashing.orgpos.rot*RAD)
            sctx.drawImage(this.animations[this.dashing.orgpos.actfrm].sprite, -w/2, -h/2, w, h)
            sctx.restore()
            sctx.globalAlpha = 1
        })
    }
    newShadow(x, y) {
        this.shadows.push({
            x: x,
            y: y
        })
    }
    draw(sctx) {
        let h = this.animations[this.frame].sprite.height
        let w = this.animations[this.frame].sprite.width
        sctx.save()
        sctx.translate(this.x,this.y)
        sctx.rotate(this.rotatation*RAD)
        sctx.drawImage(this.animations[this.frame].sprite,-w/2,-h/2, w, h)
        sctx.restore()
        this.drawShadows(sctx)
        if (this.dashing.t && this.dashing.curr < 0.9*this.dashing.length) {
            this.newShadow(this.x, this.y)
            if (this.shadows.length > 15) {
                this.shadows.shift()
            }
        } else { 
            this.shadows.shift()
        }
    }
    update(state, SFX, UI, games, gnd, scrn, sctx) {
        this.dashing.CD -= 1
        if (this.movingToCenter.t) {
            let tdd = scrn.width/2 - this.x
            let tmv = tdd/this.movingToCenter.ln
            this.x+=tmv
            this.fr -= 1
            if (this.fr == 0) {
                this.movingToCenter.t = false
            }
        }
        let r = parseFloat(this.animations[0].sprite.width)/2
        switch (state.curr) {
            case state.getReady :
                this.rotatation = 0
                this.y +=(frms%10==0) ? Math.sin(frms*RAD) :0
                this.frame += (frms%10==0) ? 1 : 0
                break
            case state.Play :
                this.frame += (frms%(1/BIRD_ANIMATION_SPEED)==0) ? 1 : 0
                if (!this.dashing.t) {
                    this.y += this.speed
                    this.setRotation()
                    this.speed += this.gravity
                }
                if(this.y + r  >= gnd.y||this.collisioned(games, UI, SFX, state))
                {
                    state.curr = state.gameOver
                    SFX.bgm.pause()
                    SFX.bgm.currentTime = 0
                    if (this.y + r >= gnd.y) {
                        if(!SFX.played) {
                            SFX.die.play()
                            SFX.played = true
                        }
                    }
                }
                

                break
            case state.gameOver : 
                this.movingToCenter.t = false
                this.frame = 1
                if(this.y + r  < gnd.y) {
                    this.y += this.speed
                    this.setRotation()
                    this.speed += this.gravity*2
                }
                else {
                    this.speed = 0
                    this.y=gnd.y-r
                    this.rotatation=90
                    
                }

                break
        }
        this.frame = this.frame%this.animations.length     
        if (this.dashing.t) {
            if (!this.dashing.dive) {
                this.x+=(this.dashing.dist/this.dashing.length)*this.dashing.dir
            } else {
                this.y+=(this.dashing.dist/this.dashing.length)*this.dashing.dir
            }
            if (this.dashing.curr >= this.dashing.length*0.05) {
                this.immune = false
            }
            this.dashing.curr+=1
            this.rotatation = 0
            if (this.dashing.curr >= this.dashing.length) {
                if (!(pressedKeys["ArrowRight"] == true && this.dashing.dir == 1) && !(pressedKeys["ArrowLeft"] && this.dashing.dir == -1) ||  this.dashing.dive == true || this.dashing.curr>= this.dashing.length*MAXDASH) {
                    this.dashing.t = false
                    this.dashing.CD = DEFAULT_DASH_CD
                    this.immune = false
                } else {
                    this.immune = false
                }
                
            }
            if (this.x<0.1*sctx.canvas.clientWidth || this.x > 0.9*sctx.canvas.clientWidth) {
                this.dashing.t = false
                this.dashing.CD = DEFAULT_DASH_CD
            }
        }  
    }
    flap(SFX) {
        if(this.y > 0) {
            SFX.flap.play()
            this.speed = -this.thrust
        }
    }
    setRotation() {
        if(this.speed <= 0) {
            this.rotatation = Math.max(BIRD_DOWN_ROTATION, BIRD_DOWN_ROTATION * this.speed/(-1*this.thrust))
        } else if(this.speed > 0 ) {
            this.rotatation = Math.min(BIRD_UP_ROTATION, BIRD_UP_ROTATION * this.speed/(this.thrust*2))
        }
    }
    goToCenter(ln=500) {
        this.movingToCenter.t = true
        this.movingToCenter.ln = ln
        this.movingToCenter.fr = ln
    }
    collisioned(games, UI, SFX, state) {
        if (this.immune) return false
        let bird = this.animations[0].sprite
        let r = bird.height/4 +bird.width/4
        var x, y, g
        if (state.gameStage == games.fireball.id) {
            var HIT = false
            games.fireball.fireballs.forEach(fb => {
                var x, y, h, w 

                x = fb.x
                y = fb.y
                h = fb.h
                w = fb.w
                if(this.x+r >= x) {
                    if(this.x+r <= x + w) {
                        if(this.y+r >= y && this.y+r <= y + h) {
                            SFX.bgm.pause()
                            SFX.bgm.currentTime = 0
                            SFX.hit.play()  
                            HIT = true
                        }
                    }
                }
                if(this.x >= x) {
                    if(this.x <= x + w) {
                        if(this.y >= y && this.y <= y + h) {
                            SFX.bgm.pause()
                            SFX.bgm.currentTime = 0
                            SFX.hit.play()  
                            HIT = true
                        }
                    }
                }
            })
            if (HIT) {
                return true
            }
        }

        if(!games.pipe.pipes.length) return

        const pipe = games.pipe
        x = pipe.pipes[0].x
        y = pipe.pipes[0].y
        g = pipe.pipes[0].g
        let t = pipe.pipes[0].top
        let b = pipe.pipes[0].bot

        let roof = y + parseFloat(pipe.h)
        let floor = roof + g
        let w = parseFloat(pipe.w)
        let d = false
        if(this.x + r>= x) {
            if(this.x + r < x + w) {
                if(this.y - r <= roof) {
                    if ((this.dashing.t && t == 0) || (!this.dashing.t && t != 0)) {
                        d = true
                    }
                } else if (this.y + r>= floor) {
                    if ((this.dashing.t && b == 0) || (!this.dashing.t && b != 0)) {
                        d = true
                    }
                }

            }
            else if(pipe.moved) {
                UI.score.curr++
                SFX.score.play()
                pipe.moved = false
            }  
        }
        if (d) {
            SFX.bgm.pause()
            SFX.bgm.currentTime = 0
            SFX.hit.play()  
            return true
        }
    }
    sizeChange(sizeRatio) {
        this.h = this.animations[this.frame].sprite.height * sizeRatio
        this.w = this.animations[this.frame].sprite.width * sizeRatio
        this.gravity *= sizeRatio
        this.thrust *= sizeRatio
        this.animations.map(e => {
            e.sprite.height *= sizeRatio
            e.sprite.width *= sizeRatio
            return true
        })
    }
 }
