let BGSPRITE = new Image()
BGSPRITE.src = "img/BG.png"
let GNDSPRITE = new Image()
GNDSPRITE.src = "img/ground.png"
let BIRDANIMS =
            [
                {sprite : new Image()},
                {sprite : new Image()},
                {sprite : new Image()},
                {sprite : new Image()},
            ]
BIRDANIMS[0].sprite.src="img/bird/b0.png";
BIRDANIMS[1].sprite.src="img/bird/b1.png";
BIRDANIMS[2].sprite.src="img/bird/b2.png";
BIRDANIMS[3].sprite.src="img/bird/b0.png";
let READY = 0

BIRDANIMS.map(x=>x.sprite).concat([GNDSPRITE, BGSPRITE]).forEach(
  el => {
    el.onload = function() {
      READY++
      if (READY==6) {
        init()
      }
    }
  }
)

