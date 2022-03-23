class State {
    constructor() {
        this.curr = 0
        this.getReady = 0
        this.Play = 1
        this.gameOver = 2
        this.currGame = 0
        this.games = {
            pipes: 0,
            fireballs:1,
        }
    }
}