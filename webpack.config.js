var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//var configFile = require('./config.dev.json');

module.exports = {
    //entry: ['./src/seigrid.js','./src/app.js'], 
    //entry: ['./Scripts/app/app.js',  // './Scripts/lib/jszip.min.js',
    entry: ['./Scripts/app/index.js',  // './Scripts/lib/jszip.min.js',
            
            /*'./content/kendo/2015.3.1111/bootstrap.css', //TODO - fix the Fonts path ****
            
            './content/kendo/2015.3.1111/kendo.common.min.css',
            './content/kendo/2015.3.1111/kendo.bootstrap.min.css',              
            
            './content/app/kendo.custom.css',
            './content/app/Site.css'*/
           ],
        //style: [ './src/controls/styles/bootstrap.css'],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'appBundle.js'
	},
	module: {
		loaders: [
			{ test: /\.png$/, loader: "url-loader?limit=100000" },
			{ test: /\.jpg$/, loader: "file-loader" },
			{ test: /\.jpeg$/, loader: "file-loader" },
			{ test: /\.gif$/, loader: "file-loader" },
			{ test: /\.txt$/, loader: "raw-loader" },
			{ test: /\.json$/, loader: "json-loader" },
            
                {test: /\.(config)$/, loader: "file-loader?name=[name].[ext]"},
            
			{ test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' },
			{ 
                test: /\.css$/,loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
                    loader: ExtractTextPlugin.extract("style", "css", "less")}, 
            {
                loader: 'babel-loader',
                exclude: /node_modules/,
                test: /\.js$/,
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                },
		    }
        ]
	},
	plugins: [
		new ExtractTextPlugin("style.css", {
			allChunks: true
		})
	],
    
    /**
     * Section: externals - Put any external config file to compile
     */
    externals: {
        AppConfig: JSON.stringify(require('./config/config.dev.json'))
    }
};
