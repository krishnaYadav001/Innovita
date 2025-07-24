/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.externals.push('canvas');
        // Add a rule to handle any .node binary modules
        config.module.rules.push({ test: /\.node$/, use: 'raw-loader' });

        // Add canvas to the list of modules to ignore
        if (!isServer) {
            config.resolve.alias = {
                ...config.resolve.alias,
                canvas: false,
            };
        }

        return config;
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
    }
}

module.exports = nextConfig
