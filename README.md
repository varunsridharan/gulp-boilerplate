# Better Gulp Boilerplate
This boilerplate is mainly focused on simplifying on creating gulp config / task 

## Features / Plugins
### Javascript 
* [Babel Core](https://www.npmjs.com/package/babel-core)
* [Babel Preset es2015](https://www.npmjs.com/package/babel-preset-es2015)
* [Babel Loader](https://www.npmjs.com/package/babel-loader)
* [Webpack Stream](https://www.npmjs.com/package/webpack-stream)
* [Gulp Uglify](https://www.npmjs.com/package/gulp-uglify)

### SCSS
* [Gulp Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
* [Gulp Clean CSS](https://www.npmjs.com/package/gulp-clean-css)
* [Gulp sass](https://www.npmjs.com/package/gulp-sass)

### Gulp Plugins
* [Gulp Concat](https://www.npmjs.com/package/gulp-concat)
* [Gulp Combine Files](https://www.npmjs.com/package/gulp-combine-files)

---

## Usage / Options 
### Step 1
Run the below cmd first
`npm install better-gulp-boilerplate --save-dev`

### Step 2
Create a ***gulpfile.js*** in your project root
and add the blow line

```js
const $gulp_tasker = require('better-gulp-tasker');
```
> Sample ***gulpfile.js***
```javascript
const $gulp_tasker = require( 'better-gulp-tasker' );
const $gulp        = require( 'gulp' );


$gulp.task( 'your-task', () => {
	// Your Custom Tax Code.
} );
```


### Step 3 
Create ***gulp-config.js*** OR ***config.js***
with the file configs.

> Sample Config File
```javascript
module.exports = {
	files: {
		// Single Compile Options
		'dir/your-file-source': {
			dist: 'path-to-save',
			rename: 'custom-file-name',
			bable: true,
		},

		// Multiple Compile Options
		'dir2/your-file-source': [
			{
				dist: 'path-to-save',
				rename: 'custom-file-name',
				bable: true
			},
			{
				dist: 'path-to-save',
				rename: 'custom-file-name',
				bable: true,
				uglify: true
			}
		]
	},

	config: {
		// Here you can write your custom config
		bable_custom_config1: {
			presets: [ '@babel/env' ],
		}
	},
};
```


## Gulp Task List

### scss
This task will compile all SCSS files that are listed in the config

**Usage :** ` gulp scss `

### js
This task will compile all JS files that are listed in the config

**Usage :** ` gulp js `

### watch:scss
This task will watch for any changes that are related to SCSS files which are listed in config and then compile the changed file.

**Usage :** ` gulp watch:scss `

### watch:js
This task will watch for any changes that are related to JS files which are listed in config and then compile the changed file.

**Usage :** ` gulp watch:js `

### watch
This task will run 2 sub task
1. `watch:scss`
2. `watch:js`

---


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
            webpack:true
        },
    },
	
	default_config:{ /* Please Check Config.js */ }
}
```

## F.A.Q

### 1. How i can trigger JS / CSS File compile when editing a child file.
Use can provide gulp about your JS / CSS child files for each and every file. please check the example below
#### For JAVASCRIPT
```json
"js" : {
	"src/js/core.js":{
		dist:"assets/js/",
		watch:["src/js/core-files/*.js"]
	}
}
```

#### For SCSS / CSS
```json
"scss" : {
	"src/scss/core.scss":{
		dist:"assets/css/",
		watch:["src/css/core-files/*.scss","src/css/sub-folder/*.*"]
	}
}
```

### 2. How i can write my custom gulp task without modifying the boilerplate source code
You can write your custom gulp task inside `gulp-custom.js` file which will never get overrided. and its safe to have all your Gulp task inside another file.
and it automatically dose includes. so you dont have any do anything else. 

---
## Contribute
If you would like to help, please take a look at the list of
[issues](https://github.com/varunsridharan/better-gulp-tasker/issues) or the [To Do](#-todo) checklist.

## License
This project is licensed under **General Public License v3.0 license**. See the [LICENSE](LICENSE) file for more info.

## Copyright
2017 - 2018 Varun Sridharan, [varunsridharan.in](https://varunsridharan.in/)

If you find it useful, let me know :wink:

You can contact me on [Twitter](https://twitter.com/varunsridharan2) or through my [email](mailto:varunsridharan23@gmail.com).

## Backed By
| [![DigitalOcean](https://vsp.ams3.cdn.digitaloceanspaces.com/cdn/DO_Logo_Horizontal_Blue-small.png)](https://s.svarun.in/Ef)           | [![JetBrains](https://vsp.ams3.cdn.digitaloceanspaces.com/cdn/phpstorm-small.png?v3)](https://www.jetbrains.com) |  [![Tidio Chat](https://vsp.ams3.cdn.digitaloceanspaces.com/cdn/tidiochat-small.png)](https://tidiochat.com) |
| --- | --- | --- |
