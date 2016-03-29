module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        exec: {
            package: {
                command: "tfx extension create --manifest-globs vss-extension.json",
                stdout: true,
                stderr: true
            },
            publish: {
                command: "tfx extension publish --token <token> --manifest-globs vss-extension.json",
                stdout: true,
                stderr: true
            },
            initdev: {
                command: "npm install && typings install ",
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
                          'node_modules/jquery/dist/jquery.min.js'
                      ],
                      dest: 'scripts/lib',
                      filter: 'isFile'
                  }]
            }
        },
        typescript: {
            compile: {
                src: ['scripts/**/*.ts'],
                dest: 'scripts',
                options: {
                    module: 'amd', 
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