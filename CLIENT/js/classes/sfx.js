class Sfx {
    constructor() {
        this.start = new Audio();
        this.flap = new Audio();
        this.score = new Audio();
        this.hit = new Audio();
        this.die = new Audio();
        this.start.src = "sfx/start.wav";
        this.flap.src = "sfx/flap.wav";
        this.score.src = "sfx/score.wav";
        this.hit.src = "sfx/hit.wav";
        this.die.src = "sfx/die.wav";

        this.bgm = new Audio();
        this.played = false;
        this.bgm.loop = true;
        this.sources = [
            {title:"bgm", demotime: ''},
            {title:"wellerman", demotime: ''},
            {title:"badApple", demotime: '55'},
        ];
        this.songIndex = 0;
        this.bgm.src = "sfx/bgm/" + this.sources[this.songIndex].title + ".wav";
    }
    updateBGM(change, scrn, sctx) {
        this.bgm.pause();
        if (change+this.songIndex > this.sources.length-1) {
            this.songIndex = 0;
        } else if (change+this.songIndex < 0) {
            this.songIndex = this.sources.length-1
        } else {
            this.songIndex += change
        }
        this.bgm = new Audio();
        this.bgm.src = "sfx/bgm/" + this.sources[this.songIndex].title + ".wav"
        this.bgm.play();
        this.drawSong(scrn, sctx);
    }
    drawSong(scrn, sctx) {
        const fontSize = 40;
        sctx.fillStyle = '#000';
        sctx.font = `${fontSize}px Roboto`;
        const text = '🎵' + this.sources[this.songIndex].title
        const margin = 10;
        sctx.fillText(text, margin, scrn.height - margin);
        sctx.fillStyle = "#30c0df";
    }
    playOnMainScreen() {
        this.bgm.play()
        this.sources[this.songIndex].demotime
    }
}