module.exports = {
    apps: [
        {
            name: 'nami-exchange-web-v2',
            script: 'yarn start:dev',
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
