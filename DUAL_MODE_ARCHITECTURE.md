# Dual-Mode Architecture: Tauri Desktop + Web Server

This application supports **two deployment modes** with the same frontend and backend codebase:

1. **Tauri Desktop Mode**: Standalone desktop application (Windows, macOS, Linux)
2. **Web Server Mode**: Frontend served as static files + Backend as HTTP API server

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│       Shared Rust Business Logic       │
│         (src-tauri/src/api/)            │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────────┐       ┌──────────────┐
│   Tauri     │       │   Axum HTTP  │
│  Commands   │       │   Handlers   │
│   (IPC)     │       │   (REST)     │
└─────────────┘       └──────────────┘
    │                         │
    ▼                         ▼
┌─────────────┐       ┌──────────────┐
│Tauri Binary │       │ Web Server   │
│  (Desktop)  │       │   Binary     │
└─────────────┘       └──────────────┘
         ↑                   ↑
         │                   │ HTTP
         │ IPC               │
         │                   │
         └───────┬───────────┘
                 │
                 ▼
         ┌────────────────┐
         │ React Frontend │
         │  (Auto-detect) │
         └────────────────┘
```

---

## How It Works

### Frontend Environment Detection

The frontend automatically detects which mode it's running in:

**`src/config/api.ts`**:
```typescript
export const API_CONFIG = {
  // Detects Tauri by checking for __TAURI_INTERNALS__
  isTauri: typeof window !== 'undefined' &&
           (window as any).__TAURI_INTERNALS__ !== undefined,

  // API URL for web mode (configurable via environment)
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};
```

### API Client Abstraction

**`src/api/client.ts`** provides a unified API that switches between IPC and HTTP:

```typescript
export async function greet(name: string): Promise<string> {
  if (API_CONFIG.isTauri) {
    // Tauri Desktop: Use IPC
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<string>('greet', { name });
  } else {
    // Web Browser: Use HTTP
    const response = await fetch(`${API_CONFIG.apiBaseUrl}/api/greet?name=${name}`);
    const data = await response.json();
    return data.message;
  }
}
```

### Backend Shared Logic

**`src-tauri/src/api/handlers.rs`** contains all business logic:

```rust
pub fn handle_greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

This same logic is called by:
- **Tauri commands** in `tauri_app.rs` (for desktop)
- **HTTP handlers** in `web_server.rs` (for web)

---

## Development

### Tauri Desktop Mode

**Run in development:**
```bash
npm run tauri:dev
# OR
npm run tauri dev
```

**Build for production:**
```bash
npm run tauri:build
# OR
npm run tauri build
```

**Result**: Platform-specific installers:
- macOS: `.app` bundle, `.dmg` installer
- Windows: `.exe`, `.msi` installer
- Linux: `.AppImage`, `.deb`, `.rpm`

---

### Web Server Mode

**Terminal 1 - Start API Server:**
```bash
npm run start:web-server
# Runs on http://localhost:3001
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
npm run dev:web
# Runs on http://localhost:1420
```

**Visit**: `http://localhost:1420`

The frontend will automatically detect it's NOT in Tauri mode and make HTTP calls to `localhost:3001`.

---

## Production Deployment

### Option 1: Tauri Desktop App

**Build:**
```bash
npm run tauri:build
```

**Distribute**: Share the installer from `src-tauri/target/release/bundle/`

**User Experience**:
- Double-click to launch
- Everything runs locally (frontend + backend in one process)
- No network configuration needed

---

### Option 2: Web Server + Static Frontend

#### **Backend (API Server)**

**Build:**
```bash
npm run build:web-server
```

**Binary location**: `src-tauri/target/release/fresco-web-server`

**Deploy to your server** (AWS EC2, GCP, etc.):
```bash
# Upload binary
scp src-tauri/target/release/fresco-web-server user@your-server:/opt/fresco/

# Run on server
PORT=3001 /opt/fresco/fresco-web-server
```

**Production tips**:
- Use a process manager (systemd, PM2, supervisor)
- Run behind reverse proxy (nginx, Caddy)
- Enable HTTPS

---

#### **Frontend (Static Files)**

**Build:**
```bash
# Set your API server URL
VITE_API_URL=https://api.fresco.example.com npm run build:web
```

**Output**: `dist/` folder with static files

**Deploy to**:
- **AWS S3 + CloudFront**
- **Netlify**
- **Vercel**
- **nginx/Apache**
- **Any static hosting**

**Example nginx config**:
```nginx
server {
    listen 80;
    server_name fresco.example.com;
    root /var/www/fresco/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**User Experience**:
- Visit `https://fresco.example.com` in browser
- Frontend makes HTTP calls to `https://api.fresco.example.com`
- Can be accessed from any device

---

## Environment Configuration

### `.env.development`
```env
VITE_API_URL=http://localhost:3001
```

### `.env.production`
```env
# Update this to your production API server URL
VITE_API_URL=https://api.fresco.example.com
```

**Usage:**
- Vite automatically loads `.env.development` in dev mode
- Use `--mode production` to load `.env.production`
- Override with `VITE_API_URL=... npm run build:web`

---

## CORS Configuration

The web server includes CORS support in `src-tauri/src/web_server.rs`:

**Development**: Permissive CORS (allows all origins)

**Production**: Configure via environment:
```bash
CORS_ORIGIN=https://fresco.example.com cargo run --release
```

Or modify the code to use a config file.

---

## Adding New API Endpoints

When adding a new feature, follow this pattern:

### 1. Add Business Logic

**`src-tauri/src/api/handlers.rs`**:
```rust
pub fn get_user_profile(user_id: &str) -> Option<UserProfile> {
    // Your business logic here
}
```

### 2. Add Tauri Command

**`src-tauri/src/tauri_app.rs`**:
```rust
#[tauri::command]
pub fn get_user_profile(user_id: String) -> Result<UserProfile, String> {
    api::handlers::get_user_profile(&user_id)
        .ok_or_else(|| "User not found".to_string())
}

// Add to invoke_handler:
.invoke_handler(tauri::generate_handler![
    greet,
    get_user_profile, // <-- Add here
])
```

### 3. Add HTTP Handler

**`src-tauri/src/web_server.rs`**:
```rust
async fn get_user_profile_handler(
    Query(params): Query<UserProfileQuery>,
) -> Result<Json<UserProfile>, Json<ErrorResponse>> {
    api::handlers::get_user_profile(&params.user_id)
        .map(Json)
        .ok_or_else(|| Json(ErrorResponse {
            error: "User not found".to_string()
        }))
}

// Add to router:
Router::new()
    .route("/api/user-profile", get(get_user_profile_handler))
```

### 4. Add Frontend Client Method

**`src/api/client.ts`**:
```typescript
export async function getUserProfile(userId: string): Promise<UserProfile> {
  if (API_CONFIG.isTauri) {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<UserProfile>('get_user_profile', { userId });
  } else {
    const url = new URL('/api/user-profile', API_CONFIG.apiBaseUrl);
    url.searchParams.append('userId', userId);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  }
}
```

### 5. Use in Components

```typescript
import { getUserProfile } from '../api/client';

function ProfileComponent() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getUserProfile('123').then(setProfile);
  }, []);

  // Component will work in both Tauri and Web modes!
}
```

---

## Key Benefits

✅ **Code Reuse**: Same frontend, same backend logic
✅ **Flexibility**: Deploy as desktop app OR web app
✅ **Type Safety**: Rust types for both IPC and HTTP
✅ **Performance**: Tauri for native, Axum for web
✅ **Easy Testing**: Test business logic independently
✅ **Scalability**: Web mode can scale horizontally

---

## Comparison

| Feature | Tauri Desktop | Web Server |
|---------|---------------|------------|
| **Installation** | Download installer | Visit URL |
| **Backend** | Bundled (IPC) | Separate server (HTTP) |
| **Frontend** | Bundled (Webview) | Static files (Browser) |
| **Offline** | ✅ Yes | ❌ No (needs server) |
| **Updates** | Manual reinstall | Automatic (refresh page) |
| **Platform** | Windows/Mac/Linux | Any with browser |
| **Performance** | Native (faster) | Network latency |
| **Deployment** | Per-user | Centralized |

---

## Troubleshooting

### "Cannot compile Tauri"
- Tauri requires system dependencies (GTK on Linux, Xcode on macOS, etc.)
- See: https://tauri.app/v1/guides/getting-started/prerequisites

### "API calls failing in web mode"
- Check that the web server is running (`npm run start:web-server`)
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors

### "Web server not compiling"
- Make sure you're using `--no-default-features --features web-server`
- Run: `cargo clean` and try again

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run tauri:dev` | Run Tauri desktop app in development |
| `npm run tauri:build` | Build Tauri desktop app for production |
| `npm run dev:web` | Run frontend dev server (web mode) |
| `npm run build:web` | Build frontend static files |
| `npm run start:web-server` | Run API server (development) |
| `npm run build:web-server` | Build API server binary (production) |

---

## Next Steps

1. **Try both modes** to see how they work
2. **Add your own endpoints** following the pattern above
3. **Deploy** to your preferred platform(s)
4. **Customize** CORS, ports, and environment configs

Enjoy your dual-mode application! 🚀
