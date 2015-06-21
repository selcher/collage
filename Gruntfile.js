module.exports = function( grunt ) {

	// Project Configuration
	grunt.initConfig( {

		pkg : grunt.file.readJSON( 'package.json' ),

		srcFiles : 'js/src/*.js',
		buildFile : 'js/build/<%= pkg.name %>-<%= pkg.version %>.min.js',

		uglify : {
			options : {
				banner : '/**\n' +
  						' * <%= pkg.name %> - v<%= pkg.version %> - build <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %>\n' +
  						' * Copyright (c) 2014-2015 Selcher;\n' +
  						' * Distributed under the terms of the MIT license.\n' +
						' */\n'
			},
			build : {
				src : '<%= srcFiles %>',
				dest : '<%= buildFile %>'
			}
		},

		watch : {
			files: [ '<%= srcFiles %>', 'Gruntfile.js' ],
			tasks: [ 'uglify' ]
		}

	} );

	// Load the plugins
	// uglify -> minify
	// watch -> watch file changes
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	// Defalt task : just minify code
	grunt.registerTask( 'default', [ 'uglify' ] );

	// Development : watch for file changes and run:
	// 1. jasmine for code testing
	grunt.registerTask( 'dev', [ 'watch' ] );

	// Production : check code and then minify
	grunt.registerTask( 'prod', [ 'jshint', 'uglify' ] );

};
