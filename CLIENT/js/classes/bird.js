class Bird {
    constructor() {
        this.animations =
            [
                {sprite : new Image()},
                {sprite : new Image()},
                {sprite : new Image()},
                {sprite : new Image()},
            ]    
        this.animations[0].sprite.src="img/bird/b0.png";
        this.animations[1].sprite.src="img/bird/b1.png";
        this.animations[2].sprite.src="img/bird/b2.png";
        this.animations[3].sprite.src="img/bird/b0.png";
        this.rotatation = 0
        this.x = 50
        this.y =100
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
        sctx.drawImage(this.animations[this.frame].sprite,-w/2,-h/2);
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
        let x = pipe.pipes[0].x;
        let y = pipe.pipes[0].y;
        let r = bird.height/4 +bird.width/4;
        let roof = y + parseFloat(pipe.top.sprite.height);
        let floor = roof + pipe.gap;
        let w = parseFloat(pipe.top.sprite.width);
        if(this.x + r>= x)
        {
            if(this.x + r < x + w)
            {
                if(this.y - r <= roof || this.y + r>= floor)
                {
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
 };