'use strict';

module.exports = function(grunt)
{
	var
		bowerrc = grunt.file.readJSON('.bowerrc')
		, MyApp = grunt.file.readJSON('bower.json')
		, modRewrite = require('connect-modrewrite')
	;

	// Project configuration.
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json'),
		myApp: MyApp,

		watch:
		{
			stylesheets:
			{
				files: '<%= myApp.source %>/**/*.styl',
				tasks: [ 'stylesheets' ]
			},

			jade:
			{
				files: '<%= myApp.source %>/**/*.jade',
				tasks: [ 'jade' ]
			},

			copy:
			{
				files: [ '<%= myApp.source %>/**', '!<%= myApp.source %>/**/*.styl', '!<%= myApp.source %>/**/*.jade' ],
				tasks: [ 'copy' ]
			}
		},


		//serve
		connect:
		{
			server:
			{
				options:
				{
					port: 8000,
					base: '<%= myApp.build %>',
					hostname: '*',
					middleware: function(connect, options)
					{
						return [modRewrite([ '!(\\..+)$ / [L]' ]), connect["static"](String(options.base))];
					}
				}
			}
		},

		clean:
		{
			build:
			{
				src: [ './<%= myApp.build %>' ]
			},

			stylesheets:
			{
				src: [ '<%= myApp.build %>/css/*.css', '!<%= myApp.build %>/css/app.css' ]
			},

			scripts:
			{
				src: [ '<%= myApp.build %>/**/*.js', '!<%= myApp.build %>/js/app.js' ]
			}
		},


		copy:
		{
			build:
			{
				cwd: '<%= myApp.source %>',
				src: [ '**', '!**/*.styl', '!**/*.jade' ],
				dest: '<%= myApp.build %>',
				expand: true
			},
			//todo: smart copy
			bower:
			{
				cwd: bowerrc.directory,
				src: [ '**'],
				dest: '<%= myApp.buildComponents %>',
				expand: true
			}
		},


		//Copy Bower packages. Smartly
		bower:
		{
			install:
			{
				dest: './<%= myApp.buildComponents %>',
				options: {
					expand: true
				}
			}
		},

		//auto wire dependencies
		wiredep:
		{
			src:
			{
				fileTypes:
				{
					jade:
					{
						replace:
						{
							js: function (filePath)
							{
								var replace = new RegExp(".+"+(bowerrc.directory || 'bower_components'));
								return 'script(src="'+ filePath.replace(replace, (MyApp.components || 'components')) +'")';
							},
							css: function (filePath)
							{
								var replace = new RegExp(".+"+(bowerrc.directory || 'bower_components'));
								return 'link(rel="stylesheet", href="'+ filePath.replace(replace, (MyApp.components || 'components')) +'")';
							}
						}
					}
				},
				exclude: JSON.parse(MyApp.exclude),
				src: ['<%= myApp.source %>/scripts.jade', '<%= myApp.source %>/styles.jade']
			}
		},

		uglify:
		{
			build:
			{
				options:
				{
					mangle: false //!replace the names of variables and functions
				},

				files:
				{
					'<%= myApp.build %>/js/app.js': [ '<%= myApp.build %>/**/*.js' ]
				}
			}
		},


		stylus:
		{
			build:
			{
				options:
				{
					linenos: true,
					compress: false
				},
				files: [{
					expand: true,
					cwd: '<%= myApp.source %>',
					src: [ '**/*.styl' ],
					dest: '<%= myApp.build %>',
					ext: '.css'
				}]
			}
		},


		autoprefixer:
		{
			options:
			{
				browsers: ['> 10%', 'last 4 version', 'Opera 12.1']
			},
			build:
			{
				expand: true,
				cwd: '<%= myApp.build %>',
				src: [ 'css/*.css' ],
				dest: '<%= myApp.build %>'
			}
		},


		cssmin:
		{
			build:
			{
				files:
				{
					'<%= myApp.build %>/css/app.css': [ '<%= myApp.build %>/css/*.css' ]
				}
			}
		},


		jade:
		{
			compile:
			{
				options:
				{
					data: {}
				},
				files: [{
					expand: true,
					cwd: '<%= myApp.source %>',
					src: [ '**/*.jade' ],
					dest: '<%= myApp.build %>',
					ext: '.html'
				}]
			}
		}

	});

	//Loadind the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-bower');


	//task for stylesheets
	grunt.registerTask('stylesheets', 'Compiles the stylesheets.', ['stylus', 'autoprefixer',  'cssmin', 'clean:stylesheets']);

	//task for javascripts
	//grunt.registerTask('scripts', 'Compiles the JavaScript files.', ['uglify', 'clean:scripts']);

	//Build Task
	grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['wiredep', 'clean:build', 'copy', /*'bower',*/ 'stylesheets', /*'scripts',*/ 'jade']);

	//Default task(s).
	grunt.registerTask('default', 'Watches the project for changes, automatically builds them and runs a server.', ['build', 'connect', 'watch']);

};
