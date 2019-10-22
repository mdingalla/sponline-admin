import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
const COSTCENTEROWNER_TABLE = "CostCentreOwners";

let url = window.location.protocol + '//iconnect.interplex.com'
let myWeb = new Web(url);
// let myWeb = new pnp.Web(_spPageContextInfo.webAbsoluteUrl);
sp.setup({
  sp:{
      headers:{
          "Accept":"application/json;odata=verbose",
          "Content-Type":"application/json;odata=verbose",
      }
  }  
});


class CostCenterOwnerApi {
    static async GetCostCenterOwner(plant,costcentre){
        let filter = "CostCentre eq '" + costcentre + "' and Plant eq '" + plant + "'";
        return myWeb.lists.getByTitle(COSTCENTEROWNER_TABLE)
            .items.filter(filter)
            .orderBy("Created",false)
            .get();
    }
}

export default CostCenterOwnerApi;