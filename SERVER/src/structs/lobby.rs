use crate::structs::Client;
use std::collections::HashMap;

pub struct Lobby {
    m: Arc<Mutex<HashMap<String, Client>>>
}