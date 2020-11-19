import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'



let myWeb = new Web(_spPageContextInfo.siteAbsoluteUrl);

sp.setup({
  sp:{
      headers:{
          "Accept":"application/json;odata=verbose",
          "Content-Type":"application/json;odata=verbose",
      }
  }  
});

class SiteCollectionApi {
    static GetAllGroups(){
        return myWeb.siteGroups.get();
    }
    static GetUsersInGroup(grpname){

        return myWeb.siteGroups.getByName(grpname)
        .users.get();

    }

    static GetGroupById(id){
        return myWeb.siteGroups.getById(id)
        .get();
    }


}

export default SiteCollectionApi;