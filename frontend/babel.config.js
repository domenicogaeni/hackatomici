const presets = ['module:metro-react-native-babel-preset']
const plugins = [
  [
    'module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
      blocklist: null,
      allowlist: null,
      blacklist: null, // DEPRECATED
      whitelist: null, // DEPRECATED
      safe: false,
      allowUndefined: true,
      verbose: false,
    },
  ],
]

plugins.push([
  'module-resolver',
  {
    root: ['./src'],
    extensions: ['.js', '.json'],
    alias: {
      '@': './src',
    },
  },
])

module.exports = {
  presets,
  plugins,
}
