// Ref: https://github.com/DocSpring/craco-less/issues/45#issuecomment-692571756

const CracoLessPlugin = require("craco-less");

const modifiedTheme = {
  "collapse-content-bg": "#efefe7",
};

module.exports = {
  plugins: [
    // This plugin takes care of the .less files
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: modifiedTheme,
            javascriptEnabled: true,
          },
        },
      },
    },
    // This plugin take scare of the .module.less files
    {
      plugin: CracoLessPlugin,
      options: {
        modifyLessRule: function (lessRule, _context) {
          lessRule.test = /\.(less)$/;
          lessRule.use = [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  modifyVars: modifiedTheme,
                  javascriptEnabled: true,
                },
              },
            },
          ];
          lessRule.exclude = /node_modules/;
          return lessRule;
        },
      },
    },
  ],
};
