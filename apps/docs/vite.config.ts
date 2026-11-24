import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { tanstackBlog } from '@tanstack-blog/core/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import config from './app.config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    // Framework plugin is `enforce: 'pre'`, so virtual modules resolve first.
    tanstackBlog({ config }),
    nitro(),
    tanstackStart(),
    viteReact(),
  ],
})
