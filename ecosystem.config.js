module.exports = {
    apps: [
        {
            name: 'nami-insurance-web',
            script: 'npm run start:dev',
            max_memory_restart: '2G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
