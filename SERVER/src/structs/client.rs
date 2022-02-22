use crate::Sender;

#[derive(Debug, Clone)]
pub struct Client {
    id: String,
    sender: Sender,
}

impl Client {
    pub fn id(&self) -> &str {
        return &self.id
    }
    pub fn new(id: String) -> Client {
        let sender = None;
        return Client {id, sender}
    }
}