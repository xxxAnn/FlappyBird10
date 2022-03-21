class Sfx {
    constructor() {
        this.start = new Audio()
        this.flap = new Audio()
        this.score = new Audio()
        this.hit = new Audio()
        this.die = new Audio()
        this.BGMVOLUME = 1
        this.start.src = "sfx/start.wav"
        this.flap.src = "sfx/flap.wav"
        this.score.src = "sfx/score.wav"
        this.hit.src = "sfx/hit.wav"
        this.die.src = "sfx/die.wav"

        this.bgm = new Audio()
        this.bgm.volume = this.BGMVOLUME
        this.playing = true
        this.sources = [
            {title:"[ff2] rebel army theme", demotime: '128.2'},
            {title:"wellerman", demotime: '32.1'},
            {title:"Bad apple", demotime: '55'},
            {title:"Battle against a true hero", demotime: '96.1'}
        ]
        this.songIndex = 0
        this.bgm.src = "sfx/bgm/" + this.sources[this.songIndex].title + ".wav"
    }
    updateBGM(change, scrn, sctx) {
        if (change !== 0) {
            this.bgm.pause()
            if (change+this.songIndex > this.sources.length-1) {
                this.songIndex = 0
            } else if (change+this.songIndex < 0) {
                this.songIndex = this.sources.length-1
            } else {
                this.songIndex += change
            }
            this.bgm = new Audio()
            this.bgm.volume = this.BGMVOLUME
            this.bgm.src = "sfx/bgm/" + this.sources[this.songIndex].title + ".wav"
            this.bgm.loop = true
            setTimeout(() => {
                if (this.playing === true) this.playOnMainScreen()
            }, 500)

        } else if (this.bgm.currentTime == this.bgm.duration) {
            this.bgm.pause()
            this.bgm.currentTime = this.sources[this.songIndex].demotime
            this.bgm.play()
        }
        if (scrn || sctx) return
        this.drawSong(scrn, sctx)
    }
    drawSong(scrn, sctx) {
        const fontSize = 30
        sctx.fillStyle = '#000'
        sctx.font = `${fontSize}px Roboto`
        const paused = this.playing==true? '': ' (paused)'
        const text = '🎵' + this.sources[this.songIndex].title + paused
        const margin = 10
        sctx.fillText(text, margin, scrn.height - margin)
        sctx.fillStyle = "#30c0df"
    }
    playOnMainScreen() {
        this.bgm.play()
        this.bgm.currentTime = this.sources[this.songIndex].demotime
    }
}