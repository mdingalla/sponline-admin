// const pnp = require('sp-pnp-js');
// import { sp } from "@pnp/sp";
const {sp} = require("@pnp/sp");
const shelljs = require('shelljs');
const PnpNode = require('sp-pnp-node').PnpNode;
var appconfig = require('./config/app.json')
const isTest = appconfig.isTest;
const appdir = appconfig.folder;

const murl = `/sites/app/SiteAssets/${appdir}`

const pnpNode = new PnpNode({
  config:{
    configPath: './config/private.json',
  encryptPassword: true,
  saveConfigOnDisk: true
  }
});

pnpNode.init().then((settings) => {
  console.log(settings.siteUrl);
  const web = sp.web
  // const web = new pnp.Web(settings.siteUrl);

  // pnp.setup({
  //   sp: {
  //     headers: {
  //       Accept: 'application/json; odata=verbose'
  //     }
  //   }
  // });

  return sp.web.getFolderByServerRelativeUrl(`${murl}`).files.get().then(files => {
    return files.map((file) => {
      web.getFileByServerRelativeUrl(file.ServerRelativeUrl).delete()
        .then((result) => {
          console.log(result)
        });
    });

  
  }).then(

  );




}).catch(console.log);
