// Web server binary entry point
// This binary runs the standalone HTTP API server

#[tokio::main]
async fn main() {
    // Get port from environment variable or use default
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "3001".to_string())
        .parse()
        .expect("PORT must be a valid number");

    println!("Starting Fresco Terminal API Server...");

    // Run the web server
    fresco_terminal_lib::web_server::run_web_server(port).await;
}
