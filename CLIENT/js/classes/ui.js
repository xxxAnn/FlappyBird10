
 
class Ui  {
    constructor() {
        this.getReady = {sprite : new Image()}
        this.gameOver = {sprite : new Image()}
        this.tap = [{sprite : new Image()},
            {sprite : new Image()}]
        this.score = {
            curr : 0,
            best : 0,
        }
        this.message_list = []
        this.x = 0
        this.y = 0
        this.tx = 0
        this.ty = 0
        this.frame = 0 
        this.gameOver.sprite.src="img/go.png"
        this.getReady.sprite.src="img/getready.png"
        this.tap[0].sprite.src="img/tap/t0.png"
        this.tap[1].sprite.src="img/tap/t1.png"
    }
    draw(state, sctx, scrn) {
        switch (state.curr) {
            case state.getReady :
                this.y = parseFloat(scrn.height-this.getReady.sprite.height)/2
                this.x = parseFloat(scrn.width-this.getReady.sprite.width)/2
                this.tx = parseFloat(scrn.width - this.tap[0].sprite.width)/2
                this.ty = this.y + this.getReady.sprite.height- this.tap[0].sprite.height
                sctx.drawImage(this.getReady.sprite,this.x,this.y)
                sctx.drawImage(this.tap[this.frame].sprite,this.tx,this.ty)
                break
            case state.gameOver :
                this.y = parseFloat(scrn.height-this.gameOver.sprite.height)/2
                this.x = parseFloat(scrn.width-this.gameOver.sprite.width)/2
                this.tx = parseFloat(scrn.width - this.tap[0].sprite.width)/2
                this.ty = this.y + this.gameOver.sprite.height- this.tap[0].sprite.height
                sctx.drawImage(this.gameOver.sprite,this.x,this.y)
                sctx.drawImage(this.tap[this.frame].sprite,this.tx,this.ty)
                break
        }
        this.drawScore(state, sctx, scrn)
    }
    pushMessage(txt, tick, xoffset=0, yoffset=0, size=60, color="red", fall=true) {
        this.message_list.push({
            txt: txt,
            tick: tick,
            xoffset: xoffset,
            yoffset: yoffset,
            size: size,
            length: tick,
            color: color,
            fall: fall
        })
    }
    drawScore(state, sctx, scrn) {
        sctx.fillStyle = "#FFFFFF"
        sctx.strokeStyle = "#000000"
        switch (state.curr) {
            case state.Play :
                sctx.lineWidth = "2"
                sctx.font = "35px Squada One"
                sctx.fillText(this.score.curr,scrn.width/2-5,50)
                sctx.strokeText(this.score.curr,scrn.width/2-5,50)
                break
            case state.gameOver :
                    sctx.lineWidth = "2"
                    sctx.font = "40px Squada One"
                    let sc = `SCORE :     ${this.score.curr}`
                    try {
                        this.score.best = Math.max(this.score.curr,localStorage.getItem("best"))
                        localStorage.setItem("best",this.score.best)
                        let bs = `BEST  :     ${this.score.best}`
                        sctx.fillText(sc,scrn.width/2-80,scrn.height/2+0)
                        sctx.strokeText(sc,scrn.width/2-80,scrn.height/2+0)
                        sctx.fillText(bs,scrn.width/2-80,scrn.height/2+30)
                        sctx.strokeText(bs,scrn.width/2-80,scrn.height/2+30)
                    }
                    catch(e) {
                        sctx.fillText(sc,scrn.width/2-85,scrn.height/2+15)
                        sctx.strokeText(sc,scrn.width/2-85,scrn.height/2+15)
                    }
                    
                break
        }
        if (this.message_list.length > 0) {
            this.drawMessage(sctx, scrn)
        }
    }
    drawMessage(sctx, scrn) {
        let msg = this.message_list[0]
        sctx.fillStyle = msg.color
        sctx.font = `${msg.size}px Squada One`
        sctx.lineWidth = "1"
        sctx.fillText(msg.txt,scrn.width/2-msg.xoffset, scrn.height/2+msg.yoffset)
        sctx.strokeText(msg.txt,scrn.width/2-msg.xoffset, scrn.height/2+msg.yoffset)
        this.message_list[0].tick -= 1
        if (msg.fall) {
            let k = 2
            let sublen = msg.length/k
            let sublentick = (msg.length-msg.tick)
            if (sublentick-(msg.length*((k-1)/k))>0) {
                this.message_list[0].yoffset+=((screen.height/2-50)/sublen) * -(sublen-sublentick)
            }
        }
        if (this.message_list[0].tick == 0) {
            this.message_list.shift()
        }
    }
    update(state) {
        if(state.curr == state.Play) return
        this.frame += (frms % 10==0) ? 1 :0
        this.frame = this.frame % this.tap.length
    }

 }