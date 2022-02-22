mod handlers;

pub type Shared<T> = Arc<Mutex<T>>;
pub type Lobbies = Shared<HashMap<String, Lobby>>;

fn init() {
    let l: Lobbies = Arc::new(Mutex::new(HashMap::new()));
    let new_game = warp::path("new")
        .and(warp::body::json())
        .and(warp::ws())
        .and(with_lobbies(l))
        .and_then(handlers::get_new_game);
    let look_for_game = warp::path("find")
        .and(warp::body::json())
        .and(warp::ws())
        .and(with_lobbies(l))
        .and_then(handlers::get_game);
}

fn with_lobbies(l: Lobbies) -> impl Filter<Extract = (Lobbies,), Error = Infallible> + Clone {
    warp::any().map(move || l.clone())
}