
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
let PAUSESPRITE = imageWithSource("pause")
let DASHSPRITE = imageWithSource("wing")
let BIRDANIMS = [
  {sprite : imageWithSource("bird/b0")},
  {sprite : imageWithSource("bird/b1")},
  {sprite : imageWithSource("bird/b2")},
  {sprite : imageWithSource("bird/b0")},
]
let TOP = {sprite : imageWithSource("toppipe_orange")}
let BOT = {sprite : imageWithSource("botpipe_orange")}
let TOP2 = {sprite : imageWithSource("toppipe_blue")}
let BOT2 = {sprite : imageWithSource("botpipe_blue")}
let ARROW_RIGHT = imageWithSource("arrow-right")
let ARROW_UP = imageWithSource("arrow-up")
let ARROW_LEFT = imageWithSource("arrow-left")
let INFOSPRITE = imageWithSource("info")

const BIRD_ANIMATION_SPEED = 0.0025 // (0 - 1)
const BIRD_DOWN_ROTATION = -25  // (deg)
const BIRD_UP_ROTATION = 90 // (deg)

const BIRD_DEFAULTS = {
    rotatation: 0,
    x: 50,
    y: 200,
    speed: 3,
    gravity: .525,
    dashcool: 50,
    thrust: 8.6,
    frame: 0
}

const DASHLENGTH = 5
const DASHDISTANCE = 100
const MAXDASH = 1.5
const DASH_MULTIPLIER = 2 // The pipe dashing speed multiplier
const DEFAULT_DASH_CD = 20

const PIPE_APPEARANCE_SPEED = 1/150 // (0-1), preferably <0.05, game starts breaking at ~0.03
const PIPE_DEFAULT_MOVESPEED = 1.5
const PIPE_DEFAULT_GAP = 200
const PIPE_MINIMUM_GAP = 20
const FIREBALL_SPAWNRATE = 0.08
const FIREBALL_SIZE = 75
const MAX_FIREBALL_SPEED = 1.5
const BALLSPREAD = 2e3
const FIREBALL_MOVEMENTSPEED = 5

const PIPE_ACCELERATION_RATE = 0.1 // <0.01, really small or 0, 0 == no acceleration
const PIPE_DEFAULT_THRESH = {
    app: 0,
    accel: 0,
    fb: 0,    
    dx: PIPE_DEFAULT_MOVESPEED+5,
    moveon: 0
}

const BGM_TIMEOUT = 1500 // ms

const FIRSTEVENTTHRESHOLD = 8
const SECONDEVENTTHRESHOLD = 80
const PIPE_DEFAULT_CAN_TOGGLE_EVENT = [1]

const SOUND_VOLUME = 0.2

const MENU_OPEN_LENGTH = 20

const LINEWIDTH = 5

let mousePos