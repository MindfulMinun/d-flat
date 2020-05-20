module.exports = {
    entry: [
        "./src/main.js"
    ],
    module: {
        rules: [{
            test: /\.worklet\.js$/,
            use: {
                loader: "worklet-loader",
                options: { name: "[name].js" }
            }
        }]
    }
}
