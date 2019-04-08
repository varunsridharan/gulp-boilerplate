<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Gitter chat][gitter-image]][gitter-url]

# Better Gulp Tasker
This **Better Gulp Tasker** is mainly focused on simplifying on creating gulp config / task 
to speed up the development process.

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
			bable: {
			// Your Custom Config For **Babel** 
			// Or Set True to use deafult config provided by Better Gulp Tasker Plugin.
			// If not pass a custom string and use that string in the config array to build your own common config.
			}
			watch:['file1','file2','file3'] // enter the files that are needed to be watched to trigger the above actions.
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

### Step 4
Run any of the below cmd to use this plugin

The below cmd will compile all the files are listed in the config.js / gulp-config.js
> $ gulp compile

The below cmd will trigger `gulp.watch` function to keep track of files changes and compiles the given file.
> $ gulp watch

---

## Builtin Tasks
Blow is a list of task / config options for each file object.

### General
* `dist:'file-save-path'` | Location On Where To Save The File.
* `rename:'custom-file-name'` | Custom File Name To Save Compiled File
* `watch:['file1','file2','file3'] ` | An Array of files to keep an eye for change to trigger its tasks
* `concat:true` | Please Refer To [Gulp Concat](http://npmjs.com/package/gulp-concat)
* `combine_files:true` | Please Refer To [Gulp Combine Files](https://www.npmjs.com/package/gulp-combine-files)

### SCSS / CSS
* `scss:true` | Converts SCSS Into CSS
* `minify:true` | Minify Source.
* `autoprefixer:true` | Autoprefix All CSS Properties.

### Javascript
* `webpack:true` | Run's Webpack To Compile / Bundle a file
* `bable:true` | Run's Babel To Convert **EM6 => EM6**
* `uglify:true` | Minify JS Soure Code

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


[downloads-image]: http://img.shields.io/npm/dm/better-gulp-tasker.svg
[npm-url]: https://www.npmjs.com/package/better-gulp-tasker
[npm-image]: http://img.shields.io/npm/v/better-gulp-tasker.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
