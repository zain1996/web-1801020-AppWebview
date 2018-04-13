// 导入路径包
const path = require('path'); 

// 导入html模版插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); 

// 导入生成独立文件插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// webpack配置项
module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        filename: "bundle.js?v1.0"
    },
    module:  {
		loaders:  [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			},
			{
				test:  /\.scss$/,
				loader:  "style!css!sass"
			},
			{
				test:  /\.less$/,
				loader:  "style!css!less"
			},
			{
				test: /\.(jpg|png|gif)$/,
    			loader: 'url-loader?limit=1&name=images/[hash:8].[name].[ext]'
			},
			{
				test: /\.html$/,
				loader: 'html-withimg-loader'
			}
		]
	},
    devServer: {
        contentBase: './',
        host: '10.219.157.102',
        open:true,
        port: 9090, //默认9090
        inline: true, //可以监控js变化
        proxy: {
			'/apis/**': {
				target: 'http://api.morefans.cc', // 你接口的域名
				secure: false,      // 如果是https接口，需要配置这个参数
				changeOrigin: true,     // 如果接口跨域，需要进行这个参数配置
			}
    	},
    },
    plugins: [
		new ExtractTextPlugin("styles.css?v1.0"),
		new HtmlWebpackPlugin({
		  template: './index.html',
		})
  	]
};