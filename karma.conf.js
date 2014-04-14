module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: ['karma-jasmine', 'karma-firefox-launcher', 'karma-chrome-launcher', 'karma-phantomjs-launcher'],
    reporters: 'dots',
    browsers: ['PhantomJS']
  });
};
