module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        exec: {
            package: {
                command: "tfx extension create --manifest-globs vss-extension.json",
                stdout: true,
                stderr: true
            },
            update: {
                command: "npm up --save-dev",
                stdout: true,
                stderr: true
            },
            initdev: {
                command: "npm install && typings install ",
                stdout: true,
                stderr: true
            },
            tsdlink: {
                command: "tsd link",
                stdout: true,
                stderr: true
            },
            publish: {
                command: "tfx extension publish --token ejie2d22jvcrarhqvmrpnjnzyuusd4lb53w4dmxdzdkiwcykrfna --manifest-globs vss-extension-me.json",
                stdout: true,
                stderr: true
            }
        },
        copy: {
            main: {
                files: [
                  {
                      expand: true,
                      flatten: true,
                      src: [
                          'node_modules/vss-sdk/lib/VSS.SDK.js',
                          'node_modules/moment/moment.js',
                          'node_modules/jquery/dist/jquery.js',
                          'node_modules/spectrum-colorpicker/spectrum.js',
                          'node_modules/spectrum-colorpicker/spectrum.css'
                      ],
                      dest: 'scripts/lib',
                      filter: 'isFile'
                  },
                  {
                      expand: true,
                      flatten: true,
                      src: [
                          'node_modules/moment/moment.js',
                      ],
                      dest: './',
                      filter: 'isFile'
                  },
                {
                    expand: true,
                    flatten: true,
                    src: [
                        'node_modules/moment/moment.js',
                    ],
                    dest: 'tests/',
                    filter: 'isFile'
                }
                ]
            }
        },
        typescript: {
            compile: {
                src: ['scripts/**/*.ts'],
                dest: 'scripts',
                options: {
                    module: 'amd', //or commonjs 
                    target: 'es5',
                    sourceMap: true,
                    declaration: true
                }
            }
        },
    });

    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-typescript");
};