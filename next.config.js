/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Add a rule to handle the canvas.node binary module
        config.module.rules.push({ test: /\.node$/, use: 'raw-loader' });

        // Exclude canvas from being processed by Next.js in the browser
        if (!isServer) {
            config.externals = [...(config.externals || []), 'canvas'];
        }

        // Ignore canvas in the server build as well to prevent build issues
        if (isServer) {
            const originalEntry = config.entry;
            config.entry = async () => {
                const entries = await originalEntry();
                // Prevent canvas from being included in the server bundle
                if (entries['pages/_app']) {
                    entries['pages/_app'] = entries['pages/_app'].filter(
                        (entry) => !entry.includes('canvas')
                    );
                }
                return entries;
            };
        }

        return config;
    },
    // Add this to tell Next.js to transpile the canvas module
    transpilePackages: ['canvas'],
}

module.exports = nextConfig
