class Sfx {
    constructor() {
        this.start = new Audio()
        this.flap = new Audio()
        this.score = new Audio()
        this.hit = new Audio()
        this.die = new Audio()
        this.BGMVOLUME = 0.75
        this.start.src = "sfx/start.wav"
        this.flap.src = "sfx/flap.wav"
        this.score.src = "sfx/score.wav"
        this.hit.src = "sfx/hit.wav"
        this.die.src = "sfx/die.wav"

        this.VOLUME = localStorage.getItem("FB10VOLUME")
        if (this.VOLUME == null) {
            this.VOLUME = SOUND_VOLUME
        }
        this.start.volume = this.VOLUME
        this.flap.volume = this.VOLUME
        this.score.volume = this.VOLUME
        this.hit.volume = this.VOLUME
        this.die.volume = this.VOLUME

        this.bgm = new Audio()
        this.bgm.volume = this.VOLUME
        this.played = false
        this.playing = true
        this.sources = [
            {title:"[ff2] rebel army theme", demotime: '128.2'},
            {title:"wellerman", demotime: '32.1'},
            {title:"Bad apple", demotime: '55'},
            {title:"Battle against a true hero", demotime: '96.1'},
            {title:"Bonetrousle", demotime: '109.6'}
        ];
        this.songIndex = localStorage.getItem("FB10SONGINDEX")
        if (this.songIndex == null) {
            this.songIndex = 0
        }
        this.bgm.src = "sfx/bgm/" + this.sources[this.songIndex].title + ".wav";
        this.pos = 200;
    }
    updateBGM(change, scrn, sctx, frs=false) {
        if (change !== 0) {
            this.bgm.pause()
            if (change+this.songIndex > this.sources.length-1) {
                this.songIndex = 0
            } else if (change+this.songIndex < 0) {
                this.songIndex = this.sources.length-1
            } else {
                this.songIndex += change
            }
            localStorage.setItem("FB10SONGINDEX", this.songIndex)
            this.bgm = new Audio();
            this.bgm.volume = this.VOLUME
            this.bgm.src = "sfx/bgm/" + this.sources[this.songIndex].title + ".wav"
            this.bgm.loop = true;
            this.pos = 200
            setTimeout(() => {
                if (this.playing === true) this.playOnMainScreen()
            }, 100)

        } else if ((this.bgm.currentTime == this.bgm.duration) || frs) {
            this.bgm.pause()
            this.bgm.currentTime = this.sources[this.songIndex].demotime
            this.bgm.play()
        } 
        if (scrn || sctx) return
        this.drawSong(scrn, sctx)
    }
    drawSong(scrn, sctx) {
        const fontSize = 30;
        sctx.fillStyle = '#000';
        sctx.font = `${fontSize}px Roboto`;
        const paused = this.playing==true? '': ' (paused)';
        const text = this.sources[this.songIndex].title + paused;
        const margin = 10;
        const notelength = sctx.measureText('🎵').width
        sctx.fillText('🎵', margin/2, scrn.height - margin)
        
        if (this.pos < -sctx.measureText(text).width-margin) {
            this.pos = sctx.measureText(text).width+margin 
        }
        this.pos -= 0.75;
        sctx.save();
        sctx.rect(margin + notelength, scrn.height - fontSize - margin, scrn.width/2.5, fontSize+ margin)
        sctx.clip()
        sctx.fillText(text, this.pos + notelength + margin, scrn.height - margin);
        sctx.fillStyle = "#30c0df";
        sctx.restore();
    }
    playOnMainScreen() {
        this.bgm.play()
        this.bgm.currentTime = this.sources[this.songIndex].demotime
    }
}