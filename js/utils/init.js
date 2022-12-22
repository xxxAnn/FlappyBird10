
let frms = 0
let dx = PIPE_DEFAULT_MOVESPEED
let w_ratio = 1/3
let h_ratio = 1
let PAUSED = false
// A variable for the state of the player dashing in the pipes stage of the game
// t: Whether the player is currently dashing or not
// curr: Amount of time the player has currently dashed
// CD: Dash cooldown
let isPipeDashing = {
    t: false,
    curr: 0,
    CD: 0
}
const RAD = Math.PI/180

function init() {
    const body = document.getElementsByTagName('body')[0]
    const screen = document.createElement('canvas')
    body.prepend(screen)
    const context = screen.getContext("2d")
    screen.width = Math.max(innerWidth * w_ratio, Math.min(500, innerWidth))
    screen.height = Math.max(innerHeight * h_ratio, Math.min(750, innerHeight))
    
    const state = new State()
    const sfx = new Sfx()
    const gnd = new GND()
    
    const bg = new Background(screen)
    const tutorial = new Tutorial()

    const bird = new Bird()
    const ui = new Ui()
    const sizeRatio = gnd.getSize(screen)
    const settings = new Setting(screen, state, sfx)
    const info = new Info(screen)
    const arrows = new Arrows(screen)
    const games = {
        pipe: new PipeSet(screen, sizeRatio),
        fireball: new FireballSet()
    }

    const jumpInputHandler = () => {
        if (PAUSED && settings.hovered == false) {
            sfx.bgm.play()
            PAUSED = false
        }
        switch (state.curr) {
            case state.getReady :
                handleMainScreenPress(settings, sfx, state, screen, info)
                break
            case state.Play :
                // if (settings.hovering === true) {
                //     PAUSED = !PAUSED
                //     console.log(PAUSED)
                //     sfx.playing === true ? sfx.bgm.pause(): sfx.bgm.play()
                //     sfx.playing = !sfx.playing
                //     return
                // }
                const click = arrows.handleClick(bird, context)
                if (click == true) break

                bird.flap(sfx)
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
                sfx.played = false
                state.gameStage = 0
                games.pipe.reset(null, sizeRatio)
                dx = 0
                frms = 0
                games.fireball.reset()
                ui.score.curr = 0
                sfx.played = false
                setTimeout(() => {
                    if (state.curr == state.getReady) {
                        sfx.updateBGM(0, screen, context, true)
                    }
                }, BGM_TIMEOUT)
                bird.reset()
                
                break
        }
    }
    document.onmousemove = (e) => {
        if (state.curr === state.gameOver) return
        const rect = screen.getBoundingClientRect()
        mousePos = {x:e.x-rect.x, y:e.y-rect.y}
        if (state.curr === state.getReady) {
            var hover = settings.handleMouseMove(mousePos) || info.handleMouseMove(mousePos)
            if (settings.moving == true) {
                settings.changeVolume(mousePos, sfx, context, screen)
                screen.style.cursor = 'grabbing'
                return
            }

        } else if (state.curr === state.Play) {
            var hover = arrows.handleMouseMove(mousePos)
        }
        if (hover) {
            screen.style.cursor = 'pointer'
        } else {
            screen.style.cursor = 'auto'
        }
    }
    document.onclick = () => {
        if (!sfx.playing) {
            sfx.playOnMainScreen()
        }
    }
    document.onmouseup = () => {
        arrows.buttons.forEach(b => b.active = false)
        if (!settings.moving) return
        settings.moving = false
        screen.style.cursor = 'auto'
    }
    document.onkeyup = (e) => {
        if (e.key.toLowerCase() == 'w' || e.key == " " || e.key == 'ArrowUp') {
            arrows.up.active = false
        }

        if (e.key == "ArrowRight" && state.curr == state.Play) {
            // Set whether the player is dashing to false and reset the current dash time. 
            // A check of game stage is not needed since it would not break anything even in fireball mode. 
            isPipeDashing.t = false
            isPipeDashing.curr = 0

            arrows.right.active = false
        }
        if (e.key == "ArrowLeft" && state.curr == state.Play) {
            isPipeDashing.t = false
            isPipeDashing.curr = 0

            arrows.left.active = false
        }
    }
    
    screen.tabIndex = 1;
    screen.addEventListener("mousedown", jumpInputHandler)
    document.onkeydown = (e) => {
        if (e.key.toLowerCase() == 'w' || e.key == " " || e.key == 'ArrowUp') jumpInputHandler()

        if (e.key == "ArrowRight" && state.curr == state.Play) {
            // Check if game stage is pipe, and use the corresponding dash
            if (state.gameStage == games.pipe.id) {
                games.pipe.dash()
            } else {
                bird.dash(1, context)
                arrows.right.active = true
            }
        }
        if (e.key == "ArrowLeft" && state.curr == state.Play) {
            // Dash normally if the game in not in the pipe stage. Dashing backwards is not needed at that stage.
            if (state.gameStage != games.pipe.id) {
                bird.dash(-1, context)
                arrows.left.active = true
            }
        }
        // if (e.key == "ArrowDown" && state.curr == state.Play) {
        //     bird.dash(1, context, true)
        // }
        if (e.key.toLocaleLowerCase() == 'p') {
            if (state.curr == state.Play) {
                PAUSED = !PAUSED
            }
            sfx.playing === true ? sfx.bgm.pause(): sfx.bgm.play()
            sfx.playing = !sfx.playing
        }
        if (state.curr != state.getReady) return
        else if (e.key.toLowerCase() == 'b') sfx.updateBGM(-1, screen, context, state)
        else if (e.key.toLowerCase() == 'n') sfx.updateBGM(1, screen, context, state)
        else if (e.key.toLowerCase() == 'm' && !settings.menuClosing) settings.PAGEON = !settings.PAGEON
    }

    handleSizeChange(sizeRatio, bird, games, gnd, bg)
    gameLoop(bird, state, sfx, ui, games, gnd, context, screen, bg, settings, sizeRatio, arrows, tutorial, info)
}

function gameLoop(bird, state, sfx, ui, games, gnd, context, screen, bg, settings, sizeRatio, arrows, tutorial, info) {
    update(bird, state, sfx, ui, games, gnd, screen, bg, context, settings, tutorial)
    context.clearRect(0, 0, screen.width, screen.height)
    draw(screen, context, sfx, bg, games, bird, gnd, ui, state, settings, arrows, tutorial, info)
    if (!PAUSED) {
        frms++
    }
    if (PAUSED) {
        if (ui.message_list.length == 0) {
            ui.pushMessage("PAUSED", 10, 70, 0, 60, "grey", false)
        }
    }
    requestAnimationFrame(() => {
        gameLoop(bird, state, sfx, ui, games, gnd, context, screen, bg, settings, sizeRatio, arrows, tutorial, info)
    })

}

function update(bird, state, sfx, ui, games, gnd, screen, bg, context, settings, sizeRatio, tutorial) {
    if (!PAUSED) {
        switch (state.gameStage) {
            case games.pipe.id :
                bird.update(state, sfx, ui, games, gnd, screen, context)
                games.pipe.update(state, screen, ui, bird)
                break
            case games.fireball.id :
                bird.update(state, sfx, ui, games, gnd, screen, context)
                games.fireball.update(screen, ui, bird, games, state, sizeRatio)
                break
        }
        gnd.update(state)
        bg.update(state)
    }
    

    ui.update(state)
    sfx.updateBGM(0, screen, context)
}

function draw(screen, context, sfx, bg, games, bird, gnd, ui, state, settings, arrows, tutorial, info) {
    context.fillStyle = "#30c0df"
    context.clearRect(0,0,screen.width,screen.height)
    bg.draw(screen, context)
    switch (state.gameStage) {
        case games.pipe.id :
            games.pipe.draw(context, state)
            break
        case games.fireball.id :
            games.fireball.draw(context, bird)
            break
    }
    if (state.curr == state.getReady) {
        settings.draw(context)
        info.draw(context)
    }
   
    bird.draw(context)
    gnd.draw(context, screen)
    sfx.drawSong(screen, context)
    ui.draw(state, context, screen)
    if (settings.menuPos.current !== 0 || settings.PAGEON) {
        settings.openSettings(context, screen, sfx)
    } else if (info.PAGEON) {
        info.openInfo(context, screen)
    } else {
        settings.menuPos.w = screen.width * 0.8
        settings.menuPos.h = 0
        settings.menuPos.x = (screen.width-settings.menuPos.w)/2
    }
    if (state.curr == state.Play) {
        arrows.draw(context)
        let r = 35
        let p = 0
        let s = 50
        let w = 100
        let ydelta = 95
        context.save()

        context.translate(context.canvas.clientWidth/8, context.canvas.clientHeight-ydelta)
        // context.drawImage(DASHSPRITE, context.canvas.clientWidth/8+w - s/2, context.canvas.clientHeight-ydelta-s/2, s, s)

        // If bird is not dashing/pipeDashing and their cooldown is less or equal to 0 
        if ((!bird.dashing.t || !isPipeDashing.t) && (!(bird.dashing.CD <= 0) || !(isPipeDashing.CD <= 0))) {
            context.beginPath()
            context.lineWidth = LINEWIDTH
            context.strokeStyle = 'black'
            context.fillStyle = 'hsl(0, 100%, 50%, 0.7)'
            // Draw an arc with either normal dash values for fireball stage or pipe dashing values for pipe stage
            context.arc(p, p, r, -Math.PI/2, ((Math.PI * 2) * ((DEFAULT_DASH_CD-Math.max((state.gameStage == games.fireball.id ? bird.dashing.CD : isPipeDashing.CD), 0)))/DEFAULT_DASH_CD)-Math.PI/2)
            context.lineTo(p, p)
            context.fill()
            context.closePath()
            context.beginPath()
            context.lineWidth = LINEWIDTH
            context.strokeStyle = 'black'
            // Draw an arc with either normal dash values for fireball stage or pipe dashing values for pipe stage
            context.arc(p, p, r, -Math.PI/2, ((Math.PI * 2) * ((DEFAULT_DASH_CD-Math.max((state.gameStage == games.fireball.id ? bird.dashing.CD : isPipeDashing.CD), 0)))/DEFAULT_DASH_CD)-Math.PI/2)
            context.stroke()
            

            // context.rect(context.canvas.clientWidth/16, context.canvas.clientHeight-ydelta, ((DEFAULT_DASH_CD-Math.max(bird.dashing.CD,0))/DEFAULT_DASH_CD)*w, 20)
            
            // context.fill()
            context.closePath()
        } else {
            context.beginPath()
            context.lineWidth = LINEWIDTH
            context.strokeStyle = 'black'
            context.fillStyle = 'hsl(120, 100%, 50%, 0.7)'
            context.arc(p, p, r, -Math.PI/2, ((Math.PI * 2)))
            // context.rect(context.canvas.clientWidth/16, context.canvas.clientHeight-ydelta, w, 20)
            context.fill()
            context.stroke()
            context.closePath()
            
        }
        context.drawImage(DASHSPRITE, -s/2, -s/2, s, s)
 
        
        context.restore()
    }
}
function handleSizeChange(sizeRatio, bird, games, gnd, bg) {
    bird.sizeChange(sizeRatio)
    games.pipe.sizeChange(sizeRatio)
    gnd.sizeChange(sizeRatio)
    bg.sizeChange(sizeRatio)
}

function handleMainScreenPress(settings, sfx, state, screen, info) {
    if (settings.hovering == settings.hoveringStates.gear) {
        if (settings.menuClosing) return
        return settings.PAGEON = !settings.PAGEON
    }
    if (info.hovering == info.hoveringStates.icon) {
        return info.PAGEON = !info.PAGEON
    }
    // else : 
    if (settings.hovering != settings.hoveringStates.gear && settings.hovering != settings.hoveringStates.none && settings.PAGEON) {
        if (settings.hovering == settings.hoveringStates.vol) {
            settings.moving = true
            screen.style.cursor = 'grabbing'
        } else if (settings.hovering == settings.hoveringStates.volBar) {
            settings.changeVolume(mousePos, sfx)
            settings.moving = true
            screen.style.cursor = 'grabbing'
        }
        return
    }

    // else:
    if (settings.PAGEON) {
        return settings.PAGEON = false
    }
    if (info.PAGEON) {
        return info.PAGEON = false
    }
    dx = PIPE_DEFAULT_MOVESPEED
    state.curr = state.Play
    sfx.start.play()
    sfx.playing = true
    frms = 0
    sfx.bgm.currentTime = '0'
    sfx.bgm.play()

}