use uuid::Uuid;

use crate::structs::Client;
use std::collections::HashMap;
use tokio::sync::{Mutex};
use std::sync::Arc;
use crate::Sender;

pub struct Lobby {
    m: Arc<Mutex<HashMap<String, Client>>>,
    id: String,
    _awaiting_start: bool
}

impl Lobby {
    pub async fn register(&self) -> String {
        let uuid = Uuid::new_v4().to_simple().to_string();
        
        let c = Client::new(uuid.clone());
        
        self.m.lock().await.insert(uuid.clone(), c);

        return uuid
    }
    pub fn new() -> Lobby {
        let id = Uuid::new_v4().to_simple().to_string();

        Lobby {m: Arc::new(Mutex::new(HashMap::new())), id, _awaiting_start: true}
    }
    pub fn id(&self) -> &str {
        return &self.id
    }
    pub async fn has(&self, c: &Client) -> bool {
        self.m.lock().await.values().any(|v| v.id() == c.id()) 
    }
    pub fn awaiting_start(&self) -> bool {
        self._awaiting_start
    }
}