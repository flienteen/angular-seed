module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'app/components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/components/angular-ui-router/release/angular-ui-router.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
