import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
import profile from "../reducers/profile";
import { IPersona } from "office-ui-fabric-react/lib/Persona";
import CamlBuilder = require("camljs");
import moment = require("moment");
import { IRenderListDataAsStreamResult, SharePointSPSUser, StaffMasterADData } from "../../types/models";

// const site = `${_spPageContextInfo.siteAbsoluteUrl}/cer`;
const site = "https://interplexgroup.sharepoint.com/sites/applications_Dev_Site/CER"

let myWeb = new Web(site);
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    }
  }
});

class CERApprovalMatrixApi {
    static async AddUpdateHoD(payload,id){
        if(id){
            return myWeb.lists.getByTitle("HOD").items
                .getById(id).update(payload);
        }
        else
        {
            return myWeb.lists.getByTitle("HOD").items
                .add(payload);
        }
    }

    static async SearchHoD(filter){
        return myWeb.lists.getByTitle("HOD")
            .items.filter(filter)
            .get();
    }
}

export default CERApprovalMatrixApi;