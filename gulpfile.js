var fs = require("fs");
var gulp = require('gulp');
var wait = require('gulp-wait2');
var spsave = require("spsave").spsave;
var gulpspsave = require('gulp-spsave');
var config = require('./config.json');
var notify = require('gulp-notify');
var vfs = require('vinyl-fs');
var map = require('map-stream');
var appconfig = require('./config/app.json')
var isTest = appconfig.isTest;
const subfolder = appconfig.folder;


var addinConfig = require('./config/private.json')


var spusername = config.username;
var sppassword = config.password;
var spSiteUrl = 'https://interplexgroup.sharepoint.com/sites/app';

var spRootUrl = 'https://interplexgroup.sharepoint.com/sites/app';
var spPageFolder = 'Pages';

var spSiteAssetsFolder = `SiteAssets`;



gulp.task('up', function () {

  gulp.src([`dist/${subfolder}/*.aspx`])
    .pipe(map(function (file, cb) {
      spsave({
          siteUrl: spSiteUrl,
          checkin: true,
          checkinType: 1,
        }, {
          // username: spusername,
          // password: sppassword,
          // online:true
          clientId: addinConfig.clientId,
        clientSecret: 'BeXL0Nx7beqA0Deg8aS4GhU/G5ifQ7GdZb9yGegakZQ='
        }, {
          file: file,
          folder: spPageFolder,
          base:`dist/${subfolder}`
        })
        .then(function () {}).finally(function () {
          cb();
        });
    }))


  gulp.src([`dist/${subfolder}**/*.js`, `dist/${subfolder}**/*.svg`, `dist/${subfolder}**/*.css`, `dist/${subfolder}**/*.html`])
    .pipe(map(function (file, cb) {
      spsave({
          siteUrl: spSiteUrl,
          checkin: true,
          checkinType: 1
        }, {
          // username: spusername,
          // password: sppassword,
          // online:true
          clientId: addinConfig.clientId,
          clientSecret: 'BeXL0Nx7beqA0Deg8aS4GhU/G5ifQ7GdZb9yGegakZQ='
        }, {
          file: file,
          folder: spSiteAssetsFolder
        })
        .then(function () {})
        .finally(function () {
          cb();
        });
    }))

})
