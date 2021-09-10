// const pnp = require('sp-pnp-js');
const shelljs = require('shelljs');
const PnpNode = require('sp-pnp-node').PnpNode;
var appconfig = require('./config/app.json')
const isTest = appconfig.isTest;
const isPTC = appconfig.isPTC;
const appfolder = appconfig.appfolder;
const sponlineSite = isTest ? `https://interplexgroup.sharepoint.com/sites/applications_Dev_Site` : `https://interplexgroup.sharepoint.com/sites/app`
// const appdir = isPTC ? 'ptcnext' : 'cashadvance'
// const appdir = isPTC ? 'ptcnext' : 'nontradeadmin'
// const appdir = isPTC ? 'ptcnext' : 'ptcmassapprove'
const appdir = isPTC ? 'ptcnext' : `${appfolder}`
// const appdir = isPTC ? 'ptcnext' : 'ptcmassupload'
const murl =`SiteAssets/${appdir}`;
// const murl = isTest ? '/ptcnexttest/SiteAssets/cashadvance' : '/pettycash/SiteAssets/cashadvance'
const pnpNode = new PnpNode();

pnpNode.init().then((settings) => {
  console.log(sponlineSite);
  const web = new pnp.Web(sponlineSite);

  pnp.setup({
    sp: {
      headers: {
        Accept: 'application/json; odata=verbose'
      }
    }
  });

  return web.getFolderByServerRelativeUrl(`${murl}`).files.get().then(files => {
    return files.map((file) => {
      // !isTest ?  console.log(`Deleting ${file.ServerRelativeUrl}`)
      // : 
     
      web.getFileByServerRelativeUrl(file.ServerRelativeUrl).delete()
        .then((result) => {
          // console.log(result)
          console.log(`Deleting...`,file.ServerRelativeUrl);
        });
    });

    // return web.getFolderByServerRelativeUrl("/PettyCash/SiteAssets/ptcnext/homepage").files.get().then(files => {
    //   return files.map((file) => {
    //     web.getFileByServerRelativeUrl(file.ServerRelativeUrl).delete()
    //       .then((result) => {
    //         console.log(result)
    //       });
    //   });
  }).then(
    //shelljs.exec("gulp watch")
    // web.getFolderByServerRelativeUrl(`${murl}`).folders.get().then(folders => {
    //   folders.map((folder) => {
    //     console.log(folder)
    //   })
    // })
  );

}).catch(console.log);