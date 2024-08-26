import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import manifest from "./src/extension/manifest.json" with { type: "json" };

export default (_, argv) => {
  const environment = argv.mode;
  return {
    mode: environment,
    devtool: environment === "development" ? "source-map" : false,
    entry: {
      contentScript: "./src/content/contentScript.ts",
      background: "./src/background/background.ts",
      react: "./src/react/main.tsx",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(`dist/${environment}/${manifest.version}`),
      clean: true,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve("src/extension"),
            to: path.resolve(`dist/${environment}/${manifest.version}`),
            toType: "dir"
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env',
                [
                  "@babel/preset-react",
                  { "runtime": "automatic" }
                ],
                "@babel/preset-typescript"
              ]
            }
          }
        },
        {
          test: /\.css$/i,
          include: path.resolve('src/styles'),
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts"],
    },
  }
}
