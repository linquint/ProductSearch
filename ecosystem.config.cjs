module.exports = {
  apps : [{
    name: 'ProductSearch',
    script: './build/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 7777 // Change the port number here
    },
    args: '--trace-uncaught',
  }]
};
