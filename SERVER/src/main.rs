use tokio::sync::mpsc;
use warp::ws::Message;

mod structs;

type Sender = Option<mpsc::UnboundedSender<std::result::Result<Message, warp::Error>>>;

fn main() {
    
}
