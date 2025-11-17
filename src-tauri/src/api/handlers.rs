// Shared business logic that both Tauri commands and HTTP handlers can use
// This ensures consistency between desktop and web modes

use serde::{Deserialize, Serialize};

/// Handle the greet functionality
pub fn handle_greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Add more shared business logic here as you build features
// For example:

#[derive(Serialize, Deserialize, Clone)]
pub struct Trade {
    pub id: String,
    pub symbol: String,
    pub quantity: i32,
    pub price: f64,
    pub timestamp: String,
}

#[derive(Serialize, Deserialize)]
pub struct MarketData {
    pub symbol: String,
    pub price: f64,
    pub change: f64,
    pub volume: i64,
}

// Example: Get mock trades (you can replace with real database calls later)
pub fn get_trades() -> Vec<Trade> {
    vec![
        Trade {
            id: "1".to_string(),
            symbol: "AAPL".to_string(),
            quantity: 100,
            price: 150.25,
            timestamp: "2024-01-15 09:30:00".to_string(),
        },
        Trade {
            id: "2".to_string(),
            symbol: "GOOGL".to_string(),
            quantity: 50,
            price: 2800.50,
            timestamp: "2024-01-15 09:31:00".to_string(),
        },
    ]
}

// Example: Get mock market data
pub fn get_market_data(symbol: &str) -> Option<MarketData> {
    match symbol {
        "AAPL" => Some(MarketData {
            symbol: symbol.to_string(),
            price: 150.25,
            change: 2.5,
            volume: 1_000_000,
        }),
        "GOOGL" => Some(MarketData {
            symbol: symbol.to_string(),
            price: 2800.50,
            change: -15.25,
            volume: 500_000,
        }),
        _ => None,
    }
}
