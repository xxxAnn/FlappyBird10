
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
    scrn.width = Math.max(innerWidth * w_ratio, Math.min(500, innerWidth))
    scrn.height = Math.max(innerHeight * h_ratio, Math.min(750, innerHeight))
    
    const state = new State()
    const SFX = new Sfx()
    const gnd = new GND()
    
    const bg = new Background(scrn)
    const tutorial = new Tutorial()

    const bird = new Bird()
    const UI = new Ui()
    const sizeRatio = gnd.getSize(scrn)
    const sett = new Setting(scrn, state, SFX)
    const info = new Info(scrn)
    const arrows = new Arrows(scrn)
    const games = {
        pipe: new PipeSet(scrn, sizeRatio),
        fireball: new FireballSet()
    }

    const jumpInputHandler = () => {
        if (PAUSED && sett.hovered == false) {
            SFX.bgm.play()
            PAUSED = false
        }
        switch (state.curr) {
            case state.getReady :
                handleMainScreenPress(sett, SFX, state, scrn, info)
                break
            case state.Play :
                // if (sett.hovering === true) {
                //     PAUSED = !PAUSED
                //     console.log(PAUSED)
                //     SFX.playing === true ? SFX.bgm.pause(): SFX.bgm.play()
                //     SFX.playing = !SFX.playing
                //     return
                // }
                const click = arrows.handleClick(bird, sctx)
                if (click == true) break

                bird.flap(SFX)
                arrows.up.active = true
                break
            case state.gameOver :
                state.curr = state.getReady
                bird.speed = BIRD_DEFAULTS.speed
                bird.y = BIRD_DEFAULTS.y
                bird.x = BIRD_DEFAULTS.x
                bird.rotatation = 0
                bird.movingToCenter.t = false
                bird.reset()
                arrows.buttons.forEach(b => b.active = false)
                SFX.played = false
                state.gameStage = 0
                games.pipe.reset(null, sizeRatio)
                dx = 0
                frms = 0
                games.fireball.reset()
                UI.score.curr = 0
                SFX.played = false
                setTimeout(() => {
                    if (state.curr == state.getReady) {
                        SFX.updateBGM(0, scrn, sctx, true)
                    }
                }, BGM_TIMEOUT)
                bird.reset()
                
                break
        }
    }
    document.onmousemove = (e) => {
        if (state.curr === state.gameOver) return
        const rect = scrn.getBoundingClientRect()
        mousePos = {x:e.x-rect.x, y:e.y-rect.y}
        if (state.curr === state.getReady) {
            var hover = sett.handleMouseMove(mousePos) || info.handleMouseMove(mousePos)
            if (sett.moving == true) {
                sett.changeVolume(mousePos, SFX, sctx, scrn)
                scrn.style.cursor = 'grabbing'
                return
            }

        } else if (state.curr === state.Play) {
            var hover = arrows.handleMouseMove(mousePos)
        }
        if (hover) {
            scrn.style.cursor = 'pointer'
        } else {
            scrn.style.cursor = 'auto'
        }
    }
    document.onclick = () => {
        if (!SFX.playing) {
            SFX.playOnMainScreen()
        }
    }
    document.onmouseup = () => {
        arrows.buttons.forEach(b => b.active = false)
        if (!sett.moving) return
        sett.moving = false
        scrn.style.cursor = 'auto'
    }
    document.onkeyup = (e) => {
        if (e.key.toLowerCase() == 'w' || e.key == " " || e.key == 'ArrowUp') {
            arrows.up.active = false
        }

        if (e.key == "ArrowRight" && state.curr == state.Play) {
            arrows.right.active = false
        }
        if (e.key == "ArrowLeft" && state.curr == state.Play) {
            arrows.left.active = false
        }
    }
    
    scrn.tabIndex = 1;
    scrn.addEventListener("mousedown", jumpInputHandler)
    document.onkeydown = (e) => {
        if (e.key.toLowerCase() == 'w' || e.key == " " || e.key == 'ArrowUp') jumpInputHandler()

        if (e.key == "ArrowRight" && state.curr == state.Play) {
            bird.dash(1, sctx)
            arrows.right.active = true
        }
        if (e.key == "ArrowLeft" && state.curr == state.Play) {
            bird.dash(-1, sctx)
            arrows.left.active = true
        }
        // if (e.key == "ArrowDown" && state.curr == state.Play) {
        //     bird.dash(1, sctx, true)
        // }
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
        else if (e.key.toLowerCase() == 'm' && !sett.menuClosing) sett.PAGEON = !sett.PAGEON
    }

    handleSizeChange(sizeRatio, bird, games, gnd, bg)
    gameLoop(bird, state, SFX, UI, games, gnd, sctx, scrn, bg, sett, sizeRatio, arrows, tutorial, info)
}

function gameLoop(bird, state, sfx, ui, games, gnd, sctx, scrn, bg, sett, sizeRatio, arrows, tutorial, info) {
    update(bird, state, sfx, ui, games, gnd, scrn, bg, sctx, sett, tutorial)
    sctx.clearRect(0, 0, scrn.width, scrn.height)
    draw(scrn, sctx, sfx, bg, games, bird, gnd, ui, state, sett, arrows, tutorial, info)
    if (!PAUSED) {
        frms++
    }
    if (PAUSED) {
        if (ui.message_list.length == 0) {
            ui.pushMessage("PAUSED", 10, 70, 0, 60, "grey", false)
        }
    }
    requestAnimationFrame(() => {
        gameLoop(bird, state, sfx, ui, games, gnd, sctx, scrn, bg, sett, sizeRatio, arrows, tutorial, info)
    })

}

function update(bird, state, sfx, ui, games, gnd, scrn, bg, sctx, sett, sizeRatio, tutorial) {
    if (!PAUSED) {
        switch (state.gameStage) {
            case games.pipe.id :
                bird.update(state, sfx, ui, games, gnd, scrn, sctx)
                games.pipe.update(state, scrn, ui, bird)
                break
            case games.fireball.id :
                bird.update(state, sfx, ui, games, gnd, scrn, sctx)
                games.fireball.update(scrn, ui, bird, games, state, sizeRatio)
                break
        }
        gnd.update(state)
        bg.update(state)
    }
    

    ui.update(state)
    sfx.updateBGM(0, scrn, sctx)
}

function draw(scrn, sctx, sfx, bg, games, bird, gnd, ui, state, sett, arrows, tutorial, info) {
    sctx.fillStyle = "#30c0df"
    sctx.clearRect(0,0,scrn.width,scrn.height)
    bg.draw(scrn, sctx)
    switch (state.gameStage) {
        case games.pipe.id :
            games.pipe.draw(sctx, state)
            break
        case games.fireball.id :
            games.fireball.draw(sctx, bird)
            break
    }
    if (state.curr == state.getReady) {
        sett.draw(sctx)
        info.draw(sctx)
    }
   
    bird.draw(sctx)
    gnd.draw(sctx, scrn)
    sfx.drawSong(scrn, sctx)
    ui.draw(state, sctx, scrn)
    if (sett.menuPos.current !== 0 || sett.PAGEON) {
        sett.openSettings(sctx, scrn, sfx)
    } else if (info.PAGEON) {
        info.openInfo(sctx, scrn)
    } else {
        sett.menuPos.w = scrn.width * 0.8
        sett.menuPos.h = 0
        sett.menuPos.x = (scrn.width-sett.menuPos.w)/2
    }
    if (state.curr == state.Play) {
        arrows.draw(sctx)
        let r = 35
        let p = 0
        let s = 50
        let w = 100
        let ydelta = 95
        sctx.save()

        sctx.translate(sctx.canvas.clientWidth/8, sctx.canvas.clientHeight-ydelta)
        // sctx.drawImage(DASHSPRITE, sctx.canvas.clientWidth/8+w - s/2, sctx.canvas.clientHeight-ydelta-s/2, s, s)

        if (!bird.dashing.t && !(0==Math.max(bird.dashing.CD, 0))) {
            sctx.beginPath()
            sctx.lineWidth = LINEWIDTH
            sctx.strokeStyle = 'black'
            sctx.fillStyle = 'hsl(0, 100%, 50%, 0.7)'
            sctx.arc(p, p, r, -Math.PI/2, ((Math.PI * 2) * ((DEFAULT_DASH_CD-Math.max(bird.dashing.CD, 0)))/DEFAULT_DASH_CD)-Math.PI/2)
            sctx.lineTo(p, p)
            sctx.fill()
            sctx.closePath()
            sctx.beginPath()
            sctx.lineWidth = LINEWIDTH
            sctx.strokeStyle = 'black'
            sctx.arc(p, p, r, -Math.PI/2, ((Math.PI * 2) * ((DEFAULT_DASH_CD-Math.max(bird.dashing.CD, 0)))/DEFAULT_DASH_CD)-Math.PI/2)
            sctx.stroke()
            

            // sctx.rect(sctx.canvas.clientWidth/16, sctx.canvas.clientHeight-ydelta, ((DEFAULT_DASH_CD-Math.max(bird.dashing.CD,0))/DEFAULT_DASH_CD)*w, 20)
            
            // sctx.fill()
            sctx.closePath()
        } else {
            sctx.beginPath()
            sctx.lineWidth = LINEWIDTH
            sctx.strokeStyle = 'black'
            sctx.fillStyle = 'hsl(120, 100%, 50%, 0.7)'
            sctx.arc(p, p, r, -Math.PI/2, ((Math.PI * 2)))
            // sctx.rect(sctx.canvas.clientWidth/16, sctx.canvas.clientHeight-ydelta, w, 20)
            sctx.fill()
            sctx.stroke()
            sctx.closePath()
            
        }
        sctx.drawImage(DASHSPRITE, -s/2, -s/2, s, s)
 
        
        sctx.restore()
    }
}
function handleSizeChange(sizeRatio, bird, games, gnd, bg) {
    bird.sizeChange(sizeRatio)
    games.pipe.sizeChange(sizeRatio)
    gnd.sizeChange(sizeRatio)
    bg.sizeChange(sizeRatio)
}

function handleMainScreenPress(sett, SFX, state, scrn, info) {
    if (sett.hovering == sett.hoveringStates.gear) {
        if (sett.menuClosing) return
        return sett.PAGEON = !sett.PAGEON
    }
    if (info.hovering == info.hoveringStates.icon) {
        return info.PAGEON = !info.PAGEON
    }
    // else : 
    if (sett.hovering != sett.hoveringStates.gear && sett.hovering != sett.hoveringStates.none && sett.PAGEON) {
        if (sett.hovering == sett.hoveringStates.vol) {
            sett.moving = true
            scrn.style.cursor = 'grabbing'
        } else if (sett.hovering == sett.hoveringStates.volBar) {
            sett.changeVolume(mousePos, SFX)
            sett.moving = true
            scrn.style.cursor = 'grabbing'
        }
        return
    }

    // else:
    if (sett.PAGEON) {
        return sett.PAGEON = false
    }
    if (info.PAGEON) {
        return info.PAGEON = false
    }
    dx = PIPE_DEFAULT_MOVESPEED
    state.curr = state.Play
    SFX.start.play()
    SFX.playing = true
    frms = 0
    SFX.bgm.currentTime = '0'
    SFX.bgm.play()

}