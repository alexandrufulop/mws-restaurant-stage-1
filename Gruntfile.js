/*
 After you have changed any settings for the responsive_images task,
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
	 postcss: {
    options: {
      map: true, // inline sourcemaps

      processors: [
        require('pixrem')(), // add fallbacks for rem units
        require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
        require('cssnano')() // minify the result
      ]
    },
    dist: {
      src: 'css/src/*.css', //we pack all our css in one file
	  dest: 'css/styles.min.css',
    }
  },
    responsive_images: {
      dev: {
        options: {
          sizes: [{
            //name: 'small',
            width: 400, /* 400px for devices with smallers screen */
			//suffix: '-small',
            quality: 20
          },{
            //name: 'large',
            width: 800, /* 800 px for devices with large screen */
            //suffix: '-large',
            quality: 30
          }]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img-src/',
          dest: 'img/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['images']
        },
      },
    },

    /* Copy the "fixed" images that don't go through processing into the images/directory 
    copy: {
      dev: {
        files: [{
          expand: true,
          src: ['images_src/fixed/*.{gif,jpg,png}'],
          dest: 'images/',
          flatten: true,
        }]
      },
    },
*/
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['postcss','clean', 'mkdir', 'responsive_images']);

};
