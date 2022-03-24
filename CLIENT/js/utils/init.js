
let frms = 0
let dx = PIPE_DEFAULT_MOVESPEED
let w_ratio = 1/3
let h_ratio = 1
let PAUSED = false
const RAD = Math.PI/180

function init() {
    const body = document.getElementsByTagName('body')[0]
    const scrn = document.createElement('canvas')
    body.prepend(scrn)
    const sctx = scrn.getContext("2d")
    scrn.width = Math.max(innerWidth * w_ratio, 500)
    scrn.height = innerHeight * h_ratio
    
    const state = new State()
    const SFX = new Sfx()
    const gnd = new GND()
    
    const bg = new Background(scrn)
    const games = {
        pipe: new PipeSet(scrn),
        fireball: new FireballSet()
    }
    const bird = new Bird()
    const UI = new Ui()
    const sizeRatio = gnd.getSize(scrn)
    const sett = new Setting(scrn, state)

    const jumpInputHandler = () => {
        if (PAUSED && sett.hovered == false) {
            SFX.bgm.play()
            PAUSED = false
        }
        switch (state.curr) {
            case state.getReady :
                if (sett.hovering === true || sett.wait === true) {
                    // sett.PAGEON = !sett.PAGEON
                    sett.PAGEON = !sett.PAGEON
                    sett.wait = !sett.wait
                } else {
                    dx = PIPE_DEFAULT_MOVESPEED
                    sett.PAGEON = false
                    sett.wait = false
                    state.curr = state.Play
                    SFX.start.play()
                    SFX.playing = true
                    frms = 0
                    SFX.bgm.currentTime = '0'
                    SFX.bgm.play()
                }
                break
            case state.Play :
                if (sett.hovering === true) {
                    PAUSED = !PAUSED
                    console.log(PAUSED)
                    SFX.playing === true ? SFX.bgm.pause(): SFX.bgm.play()
                    SFX.playing = !SFX.playing
                    return
                }
                bird.flap(SFX)
                break
            case state.gameOver :
                state.curr = state.getReady
                bird.speed = BIRD_DEFAULTS.speed
                bird.y = BIRD_DEFAULTS.y
                bird.x = BIRD_DEFAULTS.x
                bird.rotatation = 0
                bird.movingToCenter.t = false
                games.pipe.FRMTHRESH.app = 0
                games.pipe.FRMTHRESH.accel = 0
                games.pipe.canToggleEvent = PIPE_DEFAULT_CAN_TOGGLE_EVENT
                games.pipe.pipes=[]
                games.fireball.fireballs = []
                state.gameStage = 0
                games.pipe.reset()
                games.fireball.reset()
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
    

    document.onmousemove = (e) => {
        const rect = scrn.getBoundingClientRect()
        sett.hovering = sett.handleMouseMove({
            x:e.x-rect.x,
            y:e.y-rect.y,
        }, scrn)
    }

    scrn.tabIndex = 1;
    scrn.addEventListener("click", jumpInputHandler)
    document.onkeydown = (e) => {
        if (e.key.toLowerCase() == 'w' || e.key == " " || e.key == 'ArrowUp') jumpInputHandler()
        if (e.key.toLocaleLowerCase() == 'p') {                
            if (state.curr == state.Play) {
                PAUSED = !PAUSED
            }
            SFX.playing === true ? SFX.bgm.pause(): SFX.bgm.play()
            SFX.playing = !SFX.playing
        }
        if (state.curr != state.getReady) return
        else if (e.key.toLowerCase() == 'b') SFX.updateBGM(-1, scrn, sctx, state)
        else if (e.key.toLowerCase() == 'n') SFX.updateBGM(1, scrn, sctx, state)
    }
    SFX.playOnMainScreen()

    handdleSizeChange(sizeRatio, bird, games, gnd, bg)
    gameLoop(bird, state, SFX, UI, games, gnd, sctx, scrn, bg, sett)
}

function gameLoop(bird, state, sfx, ui, games, gnd, sctx, scrn, bg, sett) {
    update(bird, state, sfx, ui, games, gnd, scrn, bg, sctx, sett)
    draw(scrn, sctx, sfx, bg, games, bird, gnd, ui, state, sett)
    if (!PAUSED) {
        frms++
    }
    if (PAUSED) {
        if (ui.message_list.length == 0) {
            ui.pushMessage("PAUSED", 10, 70, 0, 60, "grey", false)
        }
    }
    requestAnimationFrame(() => {
        gameLoop(bird, state, sfx, ui, games, gnd, sctx, scrn, bg, sett)
    })
}

function update(bird, state, sfx, ui, games, gnd, scrn, bg, sctx, sett) {
    if (!PAUSED && state.curr !== state.getReady) {
        switch (state.gameStage) {
            case games.pipe.id :
                bird.update(state, sfx, ui, games, gnd, scrn)
                games.pipe.update(state, scrn, ui, bird)
                break
            case games.fireball.id :
                bird.update(state, sfx, ui, games, gnd, scrn)
                games.fireball.update(scrn, ui, bird, games, state)
                break
        }
        gnd.update(state)
        bg.update(state)
    }
    

    ui.update(state)
    sfx.updateBGM(0, scrn, sctx)
}

function draw(scrn, sctx, sfx, bg, games, bird, gnd, ui, state, sett) {
    sctx.fillStyle = "#30c0df"
    sctx.fillRect(0,0,scrn.width,scrn.height)
    bg.draw(scrn, sctx)
    switch (state.gameStage) {
        case games.pipe.id :
             games.pipe.draw(sctx)
             break
        case games.fireball.id :
             games.fireball.draw(sctx, bird)
             break
    }
    sett.draw(sctx, state)
   
    bird.draw(sctx)
    gnd.draw(sctx, scrn)
    sfx.drawSong(scrn, sctx)
    ui.draw(state, sctx, scrn)
    if (sett.PAGEON===true) {
        sett.openSettings(sctx, scrn)
    }
}
function handdleSizeChange(sizeRatio, bird, games, gnd, bg) {
    bird.sizeChange(sizeRatio)
    games.pipe.sizeChange(sizeRatio)
    gnd.sizeChange(sizeRatio)
    bg.sizeChange(sizeRatio)
}