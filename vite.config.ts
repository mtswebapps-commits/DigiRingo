import { defineConfig, createServer, type Plugin } from 'vite'
import { writeFile } from 'fs/promises'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Writes dist/sitemap.xml from the site's own page data (data files, generated
// number/rate/tool pages, blog posts), so it can't drift from what the router serves.
function sitemapXml(): Plugin {
  let outDir = 'dist'
  let skip = false
  return {
    name: 'sitemap-xml',
    apply: 'build',
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); skip = c.mode === 'native' },
    async closeBundle() {
      if (skip) return
      const vite = await createServer({
        configFile: false, logLevel: 'error', appType: 'custom',
        server: { middlewareMode: true, hmr: false },
        plugins: [figmaAssetResolver()],
        resolve: { alias: { '@': path.resolve(__dirname, './src') } },
      })
      try {
        const { allSitePaths } = await vite.ssrLoadModule('/src/site/content/sitemapPaths.ts')
        const paths: string[] = await allSitePaths()
        const today = new Date().toISOString().slice(0, 10)
        const urls = paths.map((p) => `  <url><loc>https://digiringo.com${p}</loc><lastmod>${today}</lastmod></url>`)
        const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n')
        await writeFile(path.join(outDir, 'sitemap.xml'), xml)
      } finally {
        await vite.close()
      }
    },
  }
}

export default defineConfig({
  // Which web build a user is on (shown in the Control Hub).
  define: { __BUILD_ID__: JSON.stringify(new Date().toISOString().slice(0, 16).replace("T", " ")) },
  plugins: [
    figmaAssetResolver(),
    sitemapXml(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Dev: forward /api/telnyx/* to the local Telnyx proxy (server/telnyx-proxy.mjs),
  // so the app uses a same-origin path and the secret key stays server-side.
  server: {
    proxy: {
      "/api/telnyx": {
        target: `http://localhost:${process.env.TELNYX_PROXY_PORT ?? 8787}`,
        changeOrigin: true,
      },
      "/api/paypal": {
        target: `http://localhost:${process.env.TELNYX_PROXY_PORT ?? 8787}`,
        changeOrigin: true,
      },
    },
  },

  // Multi-page: the mobile app (index.html) and the Control Hub (admin.html)
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
        site: path.resolve(__dirname, 'site.html'),
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
