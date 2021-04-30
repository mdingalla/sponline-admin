import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'

const Suppliers  = "Suppliers";
const SupplierMaster = "SupplierMaster"

// let myWeb = new pnp.Web("https://iconnect.interplex.com/supplierapp");
let url = window.location.protocol + '//interplexgroup.sharepoint.com/sites/app'
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

class SupplierApi {
    static AppSearch(searchtext){
        // let filter = "substringof('" + searchtext + "',Title) or substringof('" + searchtext + "',Employee_x0020_No)";
        let filter = "substringof('" + searchtext + "',Title)";
        return myWeb.lists.getByTitle(Suppliers)
            .items
            .filter(filter)
            .orderBy('Modified',false)
            .select('*,Author/Id,Author/Title,Editor/Id,Editor/Title').expand('Author/Id,Author/Title,Editor/Id,Editor/Title')
            .get();
    }


    static GetSupplierMasterRange(){
        return myWeb.lists.getByTitle(SupplierMaster)
            .items.top(10)
            .skip(0).get()

    }

    static GetSupplierMasterByVendorCode(code){
        return myWeb.lists.getByTitle(SupplierMaster)
            .items.filter(`VendorCode eq '${code}'`)
            .get();
    }


    static AddUpdateSupplierMaster(payload,id){
        if(id){
            return myWeb.lists.getByTitle(SupplierMaster)
                .items.getById(id)
                .update(payload);
        }
        else
        {
            return myWeb.lists.getByTitle(SupplierMaster)
                .items
                .add(payload);
        }
    }
}
export default SupplierApi;