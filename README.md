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
