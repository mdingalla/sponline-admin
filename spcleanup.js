const pnp = require('sp-pnp-js');
const {sp,Web} = require("@pnp/sp");
const shelljs = require('shelljs');
const PnpNode = require('sp-pnp-node').PnpNode;
var appconfig = require('./config/app.json')
const isTest = appconfig.isTest;
const appdir =  appconfig.folder;
const url = isTest ? appconfig.relDevUrl :  appconfig.relUrl;
// const appdir = appconfig.folder;
const site = isTest ? appconfig.devUrl : appconfig.url;

const murl = `${url}/SiteAssets/${appdir}`
const pnpNode = new PnpNode();

pnpNode.init().then((settings) => {
  pnp.setup({
    sp: {
      headers: {
        Accept: 'application/json; odata=verbose'
      }
    }
  });
  const web = new pnp.Web(site);
  return web.getFolderByServerRelativeUrl(`${murl}`).files.get().then(files => {
    return files.map((file) => {
      web.getFileByServerRelativeUrl(file.ServerRelativeUrl).delete()
        .then((result) => {
          console.log('deleting file...',file.ServerRelativeUrl)
        });
    });
  })
  // .then((result)=>{
  //   console.log(result)
  // });
}).catch(console.log);
