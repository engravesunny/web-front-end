import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    server:{
        proxy: {
            '/api':{
                changeOrigin:true,
                target:'https://kecat.top',
                
            }
        }
    }
})