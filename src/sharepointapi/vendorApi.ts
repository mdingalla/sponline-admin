import { Web, sp } from "@pnp/sp";


const SUPPLIERMASTER = "SupplierMaster";

// let myWeb = new pnp.Web("http://iconnect.interplex.com");
let myWeb = new Web(_spPageContextInfo.webAbsoluteUrl + "/supplierapp");
sp.setup({
  sp:{
      headers:{
          "Accept":"application/json;odata=verbose",
          "Content-Type":"application/json;odata=verbose",
      }
  }  
});

class VendorApiResult {
    result:boolean;
    id:number;
}

class VendorApi {
    static SaveOrUpdateSupplierMaster(ID: number,body: {}){
       if(ID){
            return myWeb.lists.getByTitle(SUPPLIERMASTER).items.getById(ID)
            .update(body);
       } else {
            return myWeb.lists.getByTitle(SUPPLIERMASTER).items
            .add(body);
       }
    }

    
}

export default VendorApi;