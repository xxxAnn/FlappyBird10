class PipeSet {
    constructor() {
        this.bot = BOT
        this.top = TOP
        this.gap = 200
        this.moved = true
        this.MINGAP = 85
        this.pipes = []
        this.w;
        this.h;
    }
    draw(sctx) {
       for(let i = 0;i<this.pipes.length;i++) {
           let p = this.pipes[i];
           sctx.drawImage(this.top.sprite,p.x,p.y, this.w, this.h)
           sctx.drawImage(this.bot.sprite,p.x,p.y+parseFloat(this.h)+p.gap, this.w, this.h)
       }
    }
    update(state, scrn) {
        if(state.curr!=state.Play) return;
            if(frms%(200/dx)==0)
        {
            let g = Math.max(this.gap-(frms/50), this.MINGAP)
            this.pipes.push({x:parseFloat(scrn.width),y:-210*Math.min(Math.random()+1,1.8),gap:g});
        }
        this.pipes.forEach(pipe=>{
            pipe.x -= dx;
        })

        if(this.pipes.length&&this.pipes[0].x < -this.top.sprite.width)
        {
           this.pipes.shift();
           this.moved = true;
        }

    }
    sizeChange(sizeRatio) {
        const ratio = 1;
        this.top.sprite.height *= (sizeRatio/ratio);
        this.top.sprite.width *= (sizeRatio/ratio);
        this.bot.sprite.height *= (sizeRatio/ratio);
        this.bot.sprite.width *= (sizeRatio/ratio);
        this.w = this.top.sprite.width;
        this.h = this.top.sprite.height;
        this.gap *= (sizeRatio/ratio);
    }

};