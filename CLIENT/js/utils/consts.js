
let MAX = 0
let READY = 0

function imageWithSource(s) {
  let x = new Image()
  x.src = `img/${s}.png`
  MAX+=1
  x.onload = function() {
    READY++
    if (READY==MAX) {
      init()
    }
  }
  return x
}
let BGSPRITE = imageWithSource("BG")
let GNDSPRITE = imageWithSource("ground")
let COGSPRITE = imageWithSource("cog")
let SOUNDSPRITE = imageWithSource("speaker")
let FIREBALLSPRITE = imageWithSource("fireball")
let BIRDANIMS = [
  {sprite : imageWithSource("bird/b0")},
  {sprite : imageWithSource("bird/b1")},
  {sprite : imageWithSource("bird/b2")},
  {sprite : imageWithSource("bird/b0")},
]
let TOP = {sprite : imageWithSource("toppipe")}
let BOT = {sprite : imageWithSource("botpipe")}

const BIRD_ANIMATION_SPEED = 1/5 // (0 - 1)
const BIRD_DOWN_ROTATION = -25  // (deg)
const BIRD_UP_ROTATION = 90 // (deg)

const BIRD_DEFAULTS = {
    rotatation: 0,
    x: 50,
    y: 200,
    speed: 0,
    gravity: .125,
    thrust: 3.6,
    frame: 0
}

const PIPE_APPEARANCE_SPEED = 0.005 // (0-1), preferably <0.05, game starts breaking at ~0.03
const PIPE_DEFAULT_MOVESPEED = 2
const PIPE_DEFAULT_GAP = 200
const PIPE_MINIMUM_GAP = 20

const BGM_TIMEOUT = 1500 // ms