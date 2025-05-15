/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
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
    }
}

module.exports = nextConfig
