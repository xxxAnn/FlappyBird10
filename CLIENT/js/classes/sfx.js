class Sfx {
    constructor() {
        this.start = new Audio()
        this.flap = new Audio()
        this.score = new Audio()
        this.hit = new Audio()
        this.die = new Audio()
        this.bgm = new Audio()
        this.played = false
        this.bgm.loop = true
        this.bgm.src = "sfx/bgm.wav"
        this.start.src = "sfx/start.wav"
        this.flap.src = "sfx/flap.wav"
        this.score.src = "sfx/score.wav"
        this.hit.src = "sfx/hit.wav"
        this.die.src = "sfx/die.wav"
    }
}