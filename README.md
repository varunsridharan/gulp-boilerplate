# VS Gulp Boilerplate

This boilerplate is mainly focused on 2 things `SCSS => CSS` & `EM6JS => EM5JS`

## Features / Plugins
#### Webpack & Babel 
<details>
<summary>View contents</summary>
* [Babel Core](https://www.npmjs.com/package/babel-core)
* [Webpack](https://www.npmjs.com/package/webpack)
* [Loader](https://www.npmjs.com/package/babel-loader)
* [es2015](https://www.npmjs.com/package/babel-preset-es2015)
* [Webpack Stream](https://www.npmjs.com/package/webpack-stream)
</details>

#### Gulp Core
<details>
<summary>View contents</summary>
* [Gulp Notify](https://www.npmjs.com/package/gulp-notify)
* [Gulp Util](https://www.npmjs.com/package/gulp-util)
* [Gulp Concat](https://www.npmjs.com/package/gulp-concat)
* [Gulp Sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
* [Gulp Combine Files](https://www.npmjs.com/package/gulp-combine-files)
* [Run sequence](https://www.npmjs.com/package/run-sequence)
</details>

#### Gulp SCSS/CSS
<details>
<summary>View contents</summary>
* [Gulp Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
* [Gulp Clean CSS](https://www.npmjs.com/package/gulp-clean-css)
* [Gulp sass](https://www.npmjs.com/package/gulp-sass)
* [Gulp Uglify](https://www.npmjs.com/package/gulp-uglify)
</details>

---

## Usage / Options
You have to configure the config.js based on your requirement.

### Sample config.js
```javascript
module.exports = {
	
	project_name : "Your Project Name",
	
	/*
	 * Below Configs Will be used to convert your SCSS Files TO CSS
	 * Config should be
	 * "source_file" => "dest_folder" 
	 * or
	 * "source_file" => {dest:"dest_folder", other_config}
	 */
	scss:{
		/*
		 *  Below File Will run all the below task
		 * 1. combine files
		 * 2. scss
		 * 3. autoprefixer
		 * 4. concat
		 * 5. minify
		 * 6. sourcemap
		 */
		"src/scss/style.scss" : "assets/css",
		
		/*
		 * Below File will run all the below task
		 * scss -- with custom config
		 * concat
		 * sourcemap
		 * 
		 * = DISABLED =
		 * autoprefixer
		 * minify
		 */
		"src/scss/style2.scss":{
			dist:"assets/css",
			scss:{
				outputStyle: "expanded",
			},
			autoprefixer:false,
			minify:false,
		}
	},
	
    /*
     * Below Configs Will be used to compile your JS files
     * Config should be
     * "source_file" => "dest_folder" 
     * or
     * "source_file" => {dest:"dest_folder", other_config}
     */
    js:{
       
        /*
         * Below File Will run all the below task
         * 1. Combine Files
         * 2. Webpack & Babel
         */
        "src/js/script.js" : "assets/js",
        
        /*
         * Below File will run all the below task
         * Webpack & Babel
         * 
         * == DISABLED ==
         * combine_files
         */
        "src/js/script2.js":{
            dist:"assets/js",
            combine_files:false,
            webpack:true,
        }
	},
	
	default_config:{ /* Please Check Config.js */ }
}
```
