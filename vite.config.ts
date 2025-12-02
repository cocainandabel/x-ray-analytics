import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually for proxy config
function loadEnvLocal() {
  try {
    const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
    const env: Record<string, string> = {};
    envFile.split('\n').forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    });
    return env;
  } catch {
    return {};
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const envLocal = loadEnvLocal();
  const apiKey = envLocal.VITE_TWITTERAPI_KEY || env.VITE_TWITTERAPI_KEY;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/twitter': {
          target: 'https://api.twitterapi.io',
          changeOrigin: true,
          rewrite: (path) => {
            // Extract handle from the original path
            const match = path.match(/handle=([^&]+)/);
            if (match) {
              const handle = decodeURIComponent(match[1]);
              return `/twitter/user/last_tweets?userName=${encodeURIComponent(handle)}&limit=20`;
            }
            return path.replace(/^\/api\/twitter/, '/twitter/user/last_tweets');
          },
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, _req, _res) => {
              // Add API key from environment
              if (apiKey) {
                proxyReq.setHeader('x-api-key', apiKey);
              }
            });
          },
        },
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});


