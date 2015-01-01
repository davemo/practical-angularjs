###
Task: preload_angular_data
Description: preloads files listed in package.json angular_preload array and sticks
             them into a named constant inside of an injectable $preloaded module
Dependencies: grunt, fs
Contributer: @davemo

Supported formats: JSON

You'll need to place a comment block in your index page that looks like this
<!-- angular:preload --> which will be replaced with the preloaded script element in question
prior to template compilation.
###

module.exports = (grunt) ->

  grunt.registerTask "angularPreload", "preloads JSON data into index.us for angular apps", ->
    # open pkg.json
    # iterate for each member of angular_preload
    # open pages/index.us and write a block with an angular constant for each value
    pkg = grunt.file.readJSON('package.json')
    page = grunt.file.read("generated/index.html")
    constants = pkg.angularPreload.map (preload) ->
      "angular.module('$preloaded').constant('#{preload.constantName}', #{JSON.stringify(grunt.file.readJSON(preload.filePath))})"

    preloadedStuff =
      """
        <script>
          angular.module('$preloaded', []);
          #{constants.join('\n')}
        </script>
      """

    grunt.file.write("generated/index.html", page.replace("<!-- angular:preload -->", preloadedStuff))


