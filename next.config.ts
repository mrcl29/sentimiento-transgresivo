import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                // En desarrollo usa localhost:8000, en producción la URL de Render
                destination: process.env.NODE_ENV === 'development' 
                    ? 'http://127.0.0.1:8000/api/:path*'
                    : 'https://tu-app.onrender.com/api/:path*',
            },
        ];
    },
};

export default nextConfig;
