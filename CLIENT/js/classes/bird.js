class Bird {
    constructor() {
        this.animations = BIRDANIMS
        this.rotatation = 0
        this.x = 50
        this.y = 200
        this.speed = 0
        this.gravity = .125
        this.thrust = 3.6
        this.frame = 0
    }
    draw(sctx) {
        let h = this.animations[this.frame].sprite.height;
        let w = this.animations[this.frame].sprite.width;
        sctx.save();
        sctx.translate(this.x,this.y);
        sctx.rotate(this.rotatation*RAD);
        sctx.drawImage(this.animations[this.frame].sprite,-w/2,-h/2, w, h);
        sctx.restore();
    }
    update(state, SFX, UI, pipe, gnd) {
        let r = parseFloat( this.animations[0].sprite.width)/2;
        switch (state.curr) {
            case state.getReady :
                this.rotatation = 0;
                this.y +=(frms%10==0) ? Math.sin(frms*RAD) :0;
                this.frame += (frms%10==0) ? 1 : 0;
                break;
            case state.Play :
                this.frame += (frms%5==0) ? 1 : 0;
                this.y += this.speed;
                this.setRotation()
                this.speed += this.gravity;
                if(this.y + r  >= gnd.y||this.collisioned(pipe, UI, SFX))
                {
                    state.curr = state.gameOver;
                    SFX.bgm.pause()
                    SFX.bgm.currentTime = 0
                }
                
                break;
            case state.gameOver : 
                this.frame = 1;
                if(this.y + r  < gnd.y) {
                    this.y += this.speed;
                    this.setRotation()
                    this.speed += this.gravity*2;
                }
                else {
                this.speed = 0;
                this.y=gnd.y-r;
                this.rotatation=90;
                if(!SFX.played) {
                    SFX.die.play();
                    SFX.played = true;
                }
                }
                
                break;
        }
        this.frame = this.frame%this.animations.length;       
    }
    flap(SFX) {
        if(this.y > 0)
        {
            SFX.flap.play();
            this.speed = -this.thrust;
        }
    }
    setRotation() {
        if(this.speed <= 0)
        {
            
            this.rotatation = Math.max(-25, -25 * this.speed/(-1*this.thrust));
        }
        else if(this.speed > 0 ) {
            this.rotatation = Math.min(90, 90 * this.speed/(this.thrust*2));
        }
    }
    collisioned(pipe, UI, SFX) {
        if(!pipe.pipes.length) return;
        let bird = this.animations[0].sprite;
        let r = bird.height/4 +bird.width/4;
        
        var x, y
        // pipe.pipes.every((e,i) => {
        //   if (e.x <= this.x+r && e.x+pipe.w >= this.x - r) {
        //     x = e.x;
        //     y = e.y;
        //     return false
        //   } else if (e.x >= this.x-r) {
        //     x = e.x;
        //     y = e.y;
        //     return false
        //   }
        //   return true
        // })
        x = pipe.pipes[0].x
        y = pipe.pipes[0].y

        let roof = y + parseFloat(pipe.h);
        let floor = roof + pipe.gap;
        let w = parseFloat(pipe.w);
        if(this.x + r>= x)
        {
            if(this.x + r < x + w)
            {
                if(this.y - r <= roof || this.y + r>= floor)
                {
                    SFX.bgm.pause()
                    SFX.bgm.currentTime = 0
                    SFX.hit.play();  
                    return true;
                }

            }
            else if(pipe.moved)
            {
                UI.score.curr++;
                SFX.score.play();
                pipe.moved = false;
            }

            
                
        }
    }
    sizeChange(sizeRatio) {
        this.h = this.animations[this.frame].sprite.height * sizeRatio;
        this.w = this.animations[this.frame].sprite.width * sizeRatio;
        this.gravity *= sizeRatio;
        this.thrust *= sizeRatio;
        this.animations.map(e => {
            e.sprite.height *= sizeRatio;
            e.sprite.width *= sizeRatio;
            return e
        });
    }
 };