// Tauri-specific command handlers
// These are thin wrappers around the shared business logic in api/handlers

use crate::api;

/// Tauri command for greeting
#[tauri::command]
pub fn greet(name: &str) -> String {
    api::handlers::handle_greet(name)
}

/// Tauri command for getting trades
#[tauri::command]
pub fn get_trades() -> Vec<api::handlers::Trade> {
    api::handlers::get_trades()
}

/// Tauri command for getting market data
#[tauri::command]
pub fn get_market_data(symbol: String) -> Result<api::handlers::MarketData, String> {
    api::handlers::get_market_data(&symbol)
        .ok_or_else(|| format!("Market data not found for symbol: {}", symbol))
}

/// Run the Tauri application
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run_tauri_app() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_trades,
            get_market_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
