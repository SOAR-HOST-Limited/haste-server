module.exports = {
    apps : [{
      name: 'haste',
      script: 'server.js',
  
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch: ['node_modules', 'static', 'data'], // Exclude these directories from watching
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }]
  };
  