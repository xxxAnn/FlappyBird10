
let frms = 0
let dx = PIPE_DEFAULT_MOVESPEED
let w_ratio = 1/3
let h_ratio = 1
const RAD = Math.PI/180

function init() {
    const body = document.getElementsByTagName('body')[0]
    const scrn = document.createElement('canvas')
    body.prepend(scrn)
    const sctx = scrn.getContext("2d")
    scrn.width = innerWidth * w_ratio
    scrn.height = innerHeight * h_ratio
    let currentSong = 0
    
    const state = new State()
    const SFX = new Sfx()
    const gnd = new GND()   
    
    const bg = new Background(scrn)
    const pipe = new PipeSet()
    const bird = new Bird()
    const UI = new Ui()
    const sizeRatio = gnd.getSize(scrn)
    const sett = new Setting(scrn, state)

    const jumpInputHandler = () => {
        switch (state.curr) {
            case state.getReady :
                if (sett.hovered === true) {
                    sett.PAGEON = !sett.PAGEON
                } else {
                    dx = PIPE_DEFAULT_MOVESPEED
                    sett.PAGEON = false
                    state.curr = state.Play
                    SFX.start.play()
                    SFX.playing = true
                    frms = 0
                    SFX.bgm.currentTime = '0'
                    SFX.bgm.play()
                }
                break
            case state.Play :
                bird.flap(SFX)
                break
            case state.gameOver :
                state.curr = state.getReady
                bird.speed = BIRD_DEFAULTS.speed
                bird.y = BIRD_DEFAULTS.y
                pipe.FRMTHRESH.app = 0
                pipe.FRMTHRESH.accel = 0
                pipe.pipes=[]
                UI.score.curr = 0
                SFX.played = false
                setTimeout(() => {
                    if (state.curr == state.getReady) {
                        SFX.updateBGM(0, scrn, sctx, true)
                    }
                }, BGM_TIMEOUT)
                break
        }
    }
    

    scrn.onmousemove = (e) => {
        const rect = scrn.getBoundingClientRect()
        sett.hovered = sett.handleMouseMove({
            x:e.x-rect.x,
            y:e.y-rect.y,
        }) == true ? true: false;
    }

    scrn.tabIndex = 1;
    scrn.addEventListener("click", jumpInputHandler)
    document.onkeydown = (e) => {
        if (e.key == 'w' || e.key == " " || e.key == 'ArrowUp') jumpInputHandler()
        if (state.curr != state.getReady) return
        if (e.key == 'p') {
            SFX.playing === true ? SFX.bgm.pause(): SFX.bgm.play()
            SFX.playing = !SFX.playing
        }
        else if (e.key.toLowerCase() == 'b') SFX.updateBGM(-1, scrn, sctx, state)
        else if (e.key.toLowerCase() == 'n') SFX.updateBGM(1, scrn, sctx, state)
        console.log(e.key)

    }
    SFX.playOnMainScreen()

    handdleSizeChange(sizeRatio, bird, pipe, gnd, bg)
    gameLoop(bird, state, SFX, UI, pipe, gnd, sctx, scrn, bg, sett)
}

function gameLoop(bird, state, sfx, ui, pipe, gnd, sctx, scrn, bg, sett) {
    update(bird, state, sfx, ui, pipe, gnd, scrn, bg, sctx, sett)
    draw(scrn, sctx, sfx, bg, pipe, bird, gnd, ui, state, sett)
    frms++
    requestAnimationFrame(() => {
        gameLoop(bird, state, sfx, ui, pipe, gnd, sctx, scrn, bg, sett)
    })
}

function update(bird, state, sfx, ui, pipe, gnd, scrn, bg, sctx, sett) {
    bird.update(state, sfx, ui, pipe, gnd) 
    gnd.update(state)
    pipe.update(state, scrn, ui)
    

    ui.update(state)
    bg.update(state)
    sfx.updateBGM(0, scrn, sctx)
}
function draw(scrn, sctx, sfx, bg, pipe, bird, gnd, ui, state, sett) {
   sctx.fillStyle = "#30c0df"
   sctx.fillRect(0,0,scrn.width,scrn.height)
   bg.draw(scrn, sctx)
   pipe.draw(sctx)
   sett.draw(sctx, state)
   sett.update(sctx, state)
   
   bird.draw(sctx)
   gnd.draw(sctx, scrn)
   sfx.drawSong(scrn, sctx)
   ui.draw(state, sctx, scrn)
   if (sett.PAGEON) {
    sctx.beginPath()
    let w = 400
    let h = 400
    sctx.roundRect((scrn.width-w)/2,scrn.height/3,w,h,[10])
    sctx.fillStyle = "grey"
    sctx.fill()
   }
}
function handdleSizeChange(sizeRatio, bird, pipe, gnd, bg) {
  bird.sizeChange(sizeRatio)
  pipe.sizeChange(sizeRatio)
  gnd.sizeChange(sizeRatio)
  bg.sizeChange(sizeRatio)
}