/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: 'plugdj.coffee',
      tasks: 'coffee'
    },
    coffee: {
      app: {
        src: ['coffee/*.coffee'],
        dest: 'js/'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'watch');
  grunt.loadNpmTasks('grunt-coffee');

};
