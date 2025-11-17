// Fresco Terminal Library
// This library contains shared business logic and provides both Tauri and web server modes

// Shared API module with business logic
pub mod api;

// Tauri-specific application code (only compiled when tauri-app feature is enabled)
#[cfg(feature = "tauri-app")]
pub mod tauri_app;

// Web server mode (only compiled when web-server feature is enabled)
#[cfg(feature = "web-server")]
pub mod web_server;

// Re-export the main entry point for Tauri mode
#[cfg(feature = "tauri-app")]
pub use tauri_app::run_tauri_app as run;
