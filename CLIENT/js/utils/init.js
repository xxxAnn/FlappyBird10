
let frms = 0
let dx = 2;
const RAD = Math.PI/180;

function init() {
    const scrn = document.getElementById('canvas');
    const sctx = scrn.getContext("2d");
    scrn.width = innerWidth/3;
    scrn.height = innerHeight;
    const jumpInputHandler = () => {
        switch (state.curr) {
            case state.getReady :
                state.curr = state.Play;
                SFX.start.play();
                break;
            case state.Play :
                bird.flap(SFX);
                break;
            case state.gameOver :
                state.curr = state.getReady;
                bird.speed = 0;
                bird.y = 100;
                pipe.pipes=[];
                UI.score.curr = 0;
                SFX.played=false;
                break;
        }
    }
    scrn.tabIndex = 1;
    scrn.addEventListener("click", jumpInputHandler)
    scrn.onkeydown = function keyDown(e) {
        (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) && jumpInputHandler()   // Space Key or W key or arrow up
    }
    const state = new State()
    const SFX = new Sfx()
    const gnd = new GND()
    const bg = new Background(scrn)
    const pipe = new PipeSet()
    const bird = new Bird()
    const UI = new Ui()
    gameLoop(bird, state, SFX, UI, pipe, gnd, sctx, scrn, bg);
}

function gameLoop(bird, state, sfx, ui, pipe, gnd, sctx, scrn, bg) { 
    update(bird, state, sfx, ui, pipe, gnd, scrn)
    draw(scrn, sctx, bg, pipe, bird, gnd, ui, state)
    frms++
    requestAnimationFrame(() => {
        gameLoop(bird, state, sfx, ui, pipe, gnd, sctx, scrn, bg)
    })
}

function update(bird, state, sfx, ui, pipe, gnd, scrn) {
    bird.update(state, sfx, ui, pipe, gnd) 
    gnd.update(state)
    pipe.update(state, scrn)
    ui.update(state)
}
function draw(scrn, sctx, bg, pipe, bird, gnd, ui, state) {
   sctx.fillStyle = "#30c0df"
   sctx.fillRect(0,0,scrn.width,scrn.height)
   bg.draw(scrn, sctx)
   pipe.draw(sctx)
   
   bird.draw(sctx)
   gnd.draw(sctx, scrn)
   ui.draw(state, sctx, scrn)
}