import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
const COSTCENTEROWNER_TABLE = "CostCentreOwners";


let myWeb = new Web(_spPageContextInfo.siteAbsoluteUrl);sp.setup({
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

    static async GetAll(){
        return myWeb.lists.getByTitle(COSTCENTEROWNER_TABLE)
            .items
            .select("*,ManagerUserID/Title")
            .expand("ManagerUserID")
            .orderBy("Created",false)
            .getAll(5000);
    }
}

export default CostCenterOwnerApi;