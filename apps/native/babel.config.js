module.exports = function (api) {
  api.cache(true);
  
  const getEnvPath = () => {
    const appEnv = process.env.APP_ENV || process.env.NODE_ENV || 'development';
    
    if (appEnv === 'production') {
      return '.env.production';
    } else if (appEnv === 'development') {
      return '.env.development';
    } else {
      return '.env';
    }
  };
  
  return {
    presets: ["babel-preset-expo"],
    plugins: ["expo-router/babel",
      [
        'module:react-native-dotenv',
        {
          "envName": "APP_ENV",
          "moduleName": "@env",
          "path": getEnvPath(),
          "blocklist": null,
          "allowlist": null,
          "blacklist": null, 
          "whitelist": null, 
          "safe": false,
          "allowUndefined": true,
          "verbose": false
        },
      ],
    ],
  };
};