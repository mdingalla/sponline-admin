const pnp = require('sp-pnp-js');
const {sp,Web} = require("@pnp/sp");
const shelljs = require('shelljs');
const PnpNode = require('sp-pnp-node').PnpNode;
var appconfig = require('./config/app.json')
const isTest = appconfig.isTest;
const appdir =  appconfig.folder;
const url = isTest ? appconfig.devUrl :  appconfig.url;
// const appdir = appconfig.folder;
const site = isTest ? appconfig.devUrl : appconfig.url;

const murl = `SiteAssets/${appdir}`
const pnpNode = new PnpNode();

pnpNode.init().then((settings) => {
  const web = new pnp.Web(site);
  pnp.setup({
    sp: {
      headers: {
        Accept: 'application/json; odata=verbose'
      }
    }
  });
  
  return web.getFolderByServerRelativeUrl(`${murl}`)
    .files.get().then(files => {
      return files.map((file) => {
        
        web.getFileByServerRelativeUrl(file.ServerRelativeUrl).delete()
          .then((result) => {
            console.log('deleting file...',file.ServerRelativeUrl)
          });
      });
    })
 
}).catch(console.log);
