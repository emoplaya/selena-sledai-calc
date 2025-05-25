const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function (env, argv) {
  return {
    // ... existing config ...
    plugins: [
      // ... other plugins ...
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "node_modules/wa-sqlite/dist/wa-sqlite.wasm",
            to: "static/js/",
          },
        ],
      }),
    ],
  };
};
