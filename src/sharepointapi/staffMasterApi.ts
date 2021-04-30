import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
import profile from "../reducers/profile";
import { IPersona } from "office-ui-fabric-react/lib/Persona";
import CamlBuilder = require("camljs");
import moment = require("moment");
import { IRenderListDataAsStreamResult, SharePointSPSUser, StaffMasterADData } from "../../types/models";

const camlBuilder = new CamlBuilder();
const staffmaster = "Staff Master";

// let myWeb = new pnp.Web("http://iconnect.interplex.com");
let myWeb = new Web(_spPageContextInfo.webAbsoluteUrl);
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    }
  }
});

class StaffMasterApi {
  static getUser(id: number): Promise<SharePointSPSUser> {
    return myWeb.siteUsers.getById(id).expand("Groups").get();
    // .then((result)=>{
    //     return result;
    // });
  }

  static getUserByLogin(loginname: string): Promise<SharePointSPSUser> {
    return myWeb.siteUsers.getByLoginName(loginname).get();
  }

  static GetStaffById(id): Promise<any> {
    return myWeb.lists
      .getByTitle(staffmaster)
      .items.getById(id)
      .get();
  }

  static getFilterPagedData(
    listname: string,
    filter: string
  ): Promise<PagedItemCollection<StaffMasterADData[]>> {
    return myWeb.lists
      .getByTitle(listname)
      .items.filter(filter)
      .top(100)
      .getPaged();
  }

  static getUserWithLogin(): Promise<
    PagedItemCollection<StaffMasterADData[]>
  > {
    let filter = "WindowsID/Id gt 0";
    return myWeb.lists
      .getByTitle(staffmaster)
      .items.filter(filter)
      .top(100)
      .select("*,WindowsID/Id,WindowsID/Name")
      .expand("WindowsID/Id,WindowsID/Name")
      .getPaged();
  }

  static getUserWithLoginForSync(plant?:string): Promise<
    PagedItemCollection<StaffMasterADData[]>
  > {
    let deptFilter = plant ? `and Plant eq '${plant}'` : "";
    let filter = `WindowsID/Id gt 0 and SyncStatus ne 1 ${deptFilter}`;
    return myWeb.lists
      .getByTitle(staffmaster)
      .items.filter(filter)
      .top(100)
      .select("*,WindowsID/Id,WindowsID/Name")
      .expand("WindowsID/Id,WindowsID/Name")
      .getPaged();
  }

  static getStaffMasterUserByEmpNo(empno: string) {
    // let filter = "EmpNo eq '" + empno + "'";
    let filter = `EmpNo eq '${empno}'`;
    return myWeb.lists
      .getByTitle(staffmaster)
      .items.filter(filter)
      .get();
  }

  static getStaffMasterByProfile(profile: SharePointSPSUser): Promise<any> {
    //get by id
    return this.getStaffMasterByWindowsId(profile.Id).then(staff => {
      if (staff.length > 0) {
        return Promise.resolve(staff[0]);
      } else {
        //getby Name
        return this.getStaffMasterByName(profile.Title).then(staffname => {
          if (staffname.length > 0) {
            return Promise.resolve(staffname[0]);
          } else {
            return null;
          }
        });
      }
    });
  }

  static getStaffMasterByWindowsId(profileId: number): Promise<any> {
    let filter = "WindowsID/Id eq " + profileId;
    return myWeb.lists
      .getByTitle(staffmaster)
      .items.filter(filter)
      .top(100)
      .select("*,WindowsID/Id,WindowsID/Name")
      .expand("WindowsID/Id,WindowsID/Name")
      .get();
  }

  static getStaffMasterByName(fullname): Promise<any> {
    let filter = "Title eq '" + fullname + "'";
    return myWeb.lists
      .getByTitle(staffmaster)
      .items.filter(filter)
      .top(100)
      .select("*,WindowsID/Id,WindowsID/Name")
      .expand("WindowsID/Id,WindowsID/Name")
      .get();
  }

  static getStaffMasterByEmpNoEmpName(empno, empname) {
    let filter = `Title eq '${empname}' and EmpNo eq '${empno}'`;
    return myWeb.lists
      .getByTitle(staffmaster)
      .items.filter(filter)
      .get();
  }

  static GetStaffByPlantCode(plantcode) {
    let filter = `Plant eq '${plantcode}'`;
    return myWeb.lists
      .getByTitle(staffmaster)
      .items.filter(filter)
      .top(2000)
      .get();
  }

  static async GetEmptyPlantCode(plant){
    const camlquery = camlBuilder.View().RowLimit(100)
    .Query().Where().TextField("Plant").EqualTo(plant)
    .And().TextField("PlantCode").IsNull();


    const request:IRenderListDataAsStreamResult = await myWeb.lists
      .getByTitle(staffmaster)
          .renderListDataAsStream({
            ViewXml:`${camlquery.ToString()}`
        });

    return request.Row;
  }

  static GetActiveStaffByPlantCode(plantcode) {
    const xml = `<View>
        <Query>
            <Where>
                <And>
                    <Eq>
                        <FieldRef Name='Plant'/>
                        <Value Type='Text'>${plantcode}</Value>
                    </Eq>
                    <And>
                      <Neq>
                          <FieldRef Name='EmpNo'/>
                          <Value Type='Text'>-</Value>
                      </Neq>
                        <IsNull><FieldRef Name='ResignedDate'/></IsNull>
                    </And>
                </And>
            </Where>
        </Query>
      </View>`;

    const camlQuery: CamlQuery = {
      ViewXml: xml
    };
    return myWeb.lists.getByTitle(staffmaster).getItemsByCAMLQuery(camlQuery);
  }

  static UpdateStaffMaster(id,payload){
    return myWeb.lists
    .getByTitle(staffmaster)
    .items.getById(id)
    .update(payload);
  }


  static UpdateSyncStatus(id:number,isSync:boolean){
    return myWeb.lists.getByTitle(staffmaster).items.getById(id)
      .update({
        SyncStatus:isSync,
        SyncDate:moment().toISOString()
      })
  }
}

export default StaffMasterApi;
