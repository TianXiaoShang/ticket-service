const path = require("path");
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const MiniProgramTailwindWebpackPlugin = require("@dcasia/mini-program-tailwind-webpack-plugin");

module.exports = {
  transpileDependencies: ['uview-ui'],
  configureWebpack: {
    plugins: [
      new WindiCSSWebpackPlugin(),
      new MiniProgramTailwindWebpackPlugin({ enableRpx: false }),
    ],
  },
};
