// Web server mode using Axum
// This provides HTTP endpoints that mirror the Tauri commands

#[cfg(feature = "web-server")]
use axum::{
    Router,
    routing::get,
    extract::Query,
    Json,
    http::{Method, HeaderValue},
};
#[cfg(feature = "web-server")]
use tower_http::cors::CorsLayer;
#[cfg(feature = "web-server")]
use std::net::SocketAddr;
#[cfg(feature = "web-server")]
use serde::{Deserialize, Serialize};

#[cfg(feature = "web-server")]
use crate::api;

// Request/Response types for HTTP endpoints

#[cfg(feature = "web-server")]
#[derive(Deserialize)]
struct GreetQuery {
    name: String,
}

#[cfg(feature = "web-server")]
#[derive(Serialize)]
struct GreetResponse {
    message: String,
}

#[cfg(feature = "web-server")]
#[derive(Deserialize)]
struct MarketDataQuery {
    symbol: String,
}

#[cfg(feature = "web-server")]
#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

// HTTP endpoint handlers

#[cfg(feature = "web-server")]
async fn greet_handler(Query(params): Query<GreetQuery>) -> Json<GreetResponse> {
    let message = api::handlers::handle_greet(&params.name);
    Json(GreetResponse { message })
}

#[cfg(feature = "web-server")]
async fn get_trades_handler() -> Json<Vec<api::handlers::Trade>> {
    let trades = api::handlers::get_trades();
    Json(trades)
}

#[cfg(feature = "web-server")]
async fn get_market_data_handler(
    Query(params): Query<MarketDataQuery>,
) -> Result<Json<api::handlers::MarketData>, Json<ErrorResponse>> {
    api::handlers::get_market_data(&params.symbol)
        .map(Json)
        .ok_or_else(|| {
            Json(ErrorResponse {
                error: format!("Market data not found for symbol: {}", params.symbol),
            })
        })
}

#[cfg(feature = "web-server")]
pub async fn run_web_server(port: u16) {
    // Configure CORS
    let cors = if cfg!(debug_assertions) {
        // Development: permissive CORS for localhost
        CorsLayer::permissive()
    } else {
        // Production: configure specific origins
        // You can set this via environment variable
        let allowed_origin = std::env::var("CORS_ORIGIN")
            .unwrap_or_else(|_| "http://localhost:1420".to_string());

        CorsLayer::new()
            .allow_origin(allowed_origin.parse::<HeaderValue>().unwrap())
            .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
            .allow_headers(tower_http::cors::Any)
    };

    // Build the router with API routes
    let app = Router::new()
        .route("/api/greet", get(greet_handler))
        .route("/api/trades", get(get_trades_handler))
        .route("/api/market-data", get(get_market_data_handler))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    println!("🚀 Fresco Terminal API Server");
    println!("📡 Listening on http://localhost:{}", port);
    println!("📋 Available endpoints:");
    println!("   GET /api/greet?name=<name>");
    println!("   GET /api/trades");
    println!("   GET /api/market-data?symbol=<symbol>");

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind to address");

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
