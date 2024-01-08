module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.andriod.js', '.j'],
          alias: {
            tests: ['./tests/'],
            "@components": "./src/components",
            "@utils": "./src/utils",
            "@views": "./src/views",
            "@ui": "./src/ui",
            "@src": "./src",
          }
        }
      ],
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
    ]
  };
};
