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

const murl = `${url}/${appdir}`
const pnpNode = new PnpNode();
// const pnpNode = new PnpNode({
//   config:{
//     configPath: './config/private.json',
//   encryptPassword: true,
//   saveConfigOnDisk: true,
//   }
// });

pnpNode.init().then((settings) => {
  console.log(url);
  const web = new Web(site)

  pnp.setup({
    sp: {
      headers: {
        Accept: 'application/json; odata=verbose'
      }
    }
  });
  // const web = new pnp.Web(settings.siteUrl);

  // pnp.setup({
  //   sp: {
  //     headers: {
  //       Accept: 'application/json; odata=verbose'
  //     }
  //   }
  // });

  return web.getFolderByServerRelativeUrl(`${murl}`).files.get().then(files => {
    return files.map((file) => {
      web.getFileByServerRelativeUrl(file.ServerRelativeUrl).delete()
        .then((result) => {
          console.log(result)
        });
    });

  
  }).then(

  );




}).catch(console.log);
