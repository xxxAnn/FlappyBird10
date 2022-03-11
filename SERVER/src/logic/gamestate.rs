pub struct PlayerGameState {
    x: i32,
    y: i32,
    speed: i32,
    thrust: i32
}

pub struct PlayerGameStateInstruction {
    f: fn(PlayerGameState) -> PlayerGameState
}

pub fn on_jump() -> PlayerGameStateInstruction {
    |g: PlayerGameState| {
        g.speed = -g.thrust
    }
}

impl PlayerGameStateInstruction {
    pub fn execute(self, g: PlayerGameState) -> PlayerGameState {
        self.f(g)
    } 
    pub fn execute_ref(&self, g: PlayerGameState) -> PlayerGameState {
        self.f(g)
    }
}