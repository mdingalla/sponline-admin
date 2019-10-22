import { Web, sp } from "@pnp/sp";
const PLANTMASTER = "PlantMaster"
let siteColWeb = new Web(_spPageContextInfo.siteAbsoluteUrl);
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    }
  }
});

class PlantMaster {
    static GetPlants(): PromiseLike<any[]> {
      return siteColWeb.lists.getByTitle(PLANTMASTER).items.getAll();
    }
  
    static GetPlant(id): PromiseLike<any> {
      if(!id) return Promise.resolve(null)
      return siteColWeb.lists
        .getByTitle(PLANTMASTER)
        .items.getById(id)
        .get();
    }
  
    static GetPlantsByTitle(code): PromiseLike<any[]> {
      return siteColWeb.lists
        .getByTitle(PLANTMASTER)
        .items.filter("Title eq '" + code + "'")
        .get();
    }
  
    static GetPlantsByCode(code): PromiseLike<any[]> {
      return siteColWeb.lists
        .getByTitle(PLANTMASTER)
        .items.filter("Code eq '" + code + "'")
        .get();
    }
  
    static GetPlantsByPlantCode(code): PromiseLike<any[]> {
      return siteColWeb.lists
        .getByTitle(PLANTMASTER)
        .items.filter("Code eq '" + code + "'")
        .get();
    }
  
  
    static AddOrUpdate(payload,id=null){
      if(id){
        return siteColWeb.lists.getByTitle(PLANTMASTER)
        .items.getById(id).update(payload);
      }
      else
      {
        return siteColWeb.lists.getByTitle(PLANTMASTER)
        .items.add(payload)
      }
    }
  }

  export default PlantMaster;