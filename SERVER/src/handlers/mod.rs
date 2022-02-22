
use crate::routes::Lobbies;

// Upgrade to a websocket connection
pub async fn get_new_game(ws: warp::ws::Ws, body: Event, lobbies: Lobbies) -> Result<impl Reply> {
    // Creates a new lobby
    let lobby = Lobby::new();
    lobbies.lock().await.insert(
        lobby.id()
        .to_string(),
        lobby
    );

    
}
pub async fn get_game(ws: warp::ws::Ws, body: Event, lobbies: Lobbies) -> Result<impl Reply> {}