#[derive(Debug, Clone)]
pub struct Client {
    id: String,
    pub sender: Option<mpsc::UnboundedSender<std::result::Result<Message, warp::Error>>>,
}

impl Client {
    pub fn id(&self) -> &str {
        return self.id
    }
}