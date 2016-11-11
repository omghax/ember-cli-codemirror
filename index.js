/* jshint node: true */
'use strict';

var fs = require('fs');

module.exports = {
  name: 'ivy-codemirror',

  included: function(app) {
    var options = app.options.codemirror || {};
    var modes = options.modes || [];
    var keyMaps = options.keyMaps || [];
    var themes = options.themes || [];
    var addons = options.addons || [];

    if (!process.env.EMBER_CLI_FASTBOOT) {
      app.import(app.bowerDirectory + '/codemirror/lib/codemirror.css');
      app.import(app.bowerDirectory + '/codemirror/lib/codemirror.js');
      app.import(app.bowerDirectory + '/codemirror/addon/mode/simple.js');
      app.import(app.bowerDirectory + '/codemirror/addon/mode/multiplex.js');
      app.import('vendor/htmlhandlebars.js');
  
      modes.forEach(function(mode) {
        app.import(app.bowerDirectory + '/codemirror/mode/' + mode + '/' + mode + '.js');
      });
  
      keyMaps.forEach(function(keyMap) {
        app.import(app.bowerDirectory + '/codemirror/keymap/' + keyMap + '.js');
      });
  
      themes.forEach(function(theme) {
        app.import(app.bowerDirectory + '/codemirror/theme/' + theme + '.css');
      });

      addons.forEach(function(addon) {
        var addonDir = app.bowerDirectory + '/codemirror/addon/' + addon;
        if (!addonDir) { return; }

        var addonFiles = fs.readdirSync(addonDir);
        if (!addonFiles.length) { return; }

        addonFiles.forEach(function(file) {
          app.import(addonDir + '/' + file);
        });
      });
  
      app.import('vendor/ivy-codemirror/shims.js', {
        exports: {
          'codemirror': ['default']
        }
      });
    }
  }
};
