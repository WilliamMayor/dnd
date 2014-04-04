module.exports = function(grunt){
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: ['scss/**/*.scss'],
                tasks: ['css'],
                options: {
                  livereload: true,
                }
            },
            js: {
                files: ['js/**/*.js'],
                tasks: ['uglify'],
                options: {
                  livereload: true,
                }
            }
        },
        uglify: {
            build: {
                files: {
                    'main.min.js': ["js/dice.js", "js/pc.js", "js/admin.js"]
                }
            }
        },
        sass: {
            build: {
                files: {
                    'main.min.css': 'scss/main.scss'
                }
            }
        },
        cssmin: {
            build: {
                src: 'main.min.css',
                dest: 'main.min.css'
            }
        },
        cssc: {
            build: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors:    true,
                    consolidateMediaQueries:    true
                },
                files: {
                    'main.min.css': 'main.min.css'
                }
            }
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['sass', 'cssc', 'cssmin']);
};