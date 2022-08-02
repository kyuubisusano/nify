import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    // cors: {
    //   "origin": "http://localhost:8000",
    //   "methods": ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    //   "preflightContinue": false,
    //   "optionsSuccessStatus": 204
    // }
  },
  define: {
    "global": {},
  },
})
