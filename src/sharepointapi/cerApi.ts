import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
import { SPCostCenterRequest } from '../../types/models';
import { FetchClient } from "@pnp/common";

const client = new FetchClient();

import { stat } from "fs";
import { IPersonaProps } from "@fluentui/react";
import { version } from 'punycode';
const ALL = "ALL";
const CER = "CER";
const ADT = "AssetDisposal";
const CERAsset = "CERAssets";
const AssetClass = "AssetClass";
const CERApprovalMatrixtable = "CER-ApprovalMatrix";
// let url = window.location.protocol + "//iconnect.interplex.com/CER";

let myWeb = new Web(`${_spPageContextInfo.siteAbsoluteUrl}/CER`);
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    }
  }
});

class CerAPI {
  static AppSearch(searchtext) {
    // let filter = "substringof('" + searchtext + "',Title) or substringof('" + searchtext + "',Employee_x0020_No)";
    let filter =
      "substringof('" +
      searchtext +
      "',Title) or substringof('" +
      searchtext +
      "',Po_x0020_Number)";

    return myWeb.lists
      .getByTitle(CER)
      .items.filter(filter)
      .orderBy("Modified", false)
      .select("*,Author/Id,Author/Title,Editor/Id,Editor/Title")
      .expand("Author/Id,Author/Title,Editor/Id,Editor/Title")
      .get();
  }

  static ADTAppSearch(searchtext) {
    // let filter = "substringof('" + searchtext + "',Title) or substringof('" + searchtext + "',Employee_x0020_No)";

    let filter =
      "substringof('" +
      searchtext +
      "',Name) or substringof('" +
      searchtext +
      "',Po_x0020_Number) or substringof('" +
      searchtext +
      "',Asset_x0020_Number)";

    return myWeb.lists
      .getByTitle(ADT)
      .items.filter(filter)
      .orderBy("Modified", false)
      .select("*,Author/Id,Author/Title,Editor/Id,Editor/Title")
      .expand("Author/Id,Author/Title,Editor/Id,Editor/Title")
      .get();
  }

  static GetAssetCategories() {
    return myWeb.lists.getByTitle(AssetClass).items.get();
  }

  static CERReportAsset(
    startDt: Date,
    endDt: Date,
    plant: string = ALL,
    assetcategory: string = ALL,
    status: string = "APPROVED",
    assignedTo:IPersonaProps[] = []
  ) {
    let fields = `*,CER/Id,CER/Modified,CER/Title,CER/Plant,CER/scWFaction,
        CER/OData__c0fef8a6_816b_477f_adc7_99a9db09441f,
        CER/OData__386b6280_6cb8_4d5f_99c9_ee18a6c24196,
        CER/OData__59c4a160_cd59_48c2_9d66_0ed7af6bc0a6,
        CER/Asset_x0020_Number,
        CER/Po_x0020_Number,
        CER/CERStatus`;

    let plantfilter = '',assetfilter='',statusfilter = '',assignFilter='';
    let dateFilter = `(CER/Created ge datetime'${startDt.toISOString()}' and CER/Created le datetime'${endDt.toISOString()}')`
    if (plant != ALL){
     plantfilter = `CER/Plant eq '${plant}' and `;
    }
    if (assetcategory != ALL) assetfilter = `AssetCategory eq '${assetcategory}' and`;
    if (status) {
      if (status == "PENDING") {
        statusfilter = `substringof('Waiting',CER/CERStatus) and `;
        if(assignedTo.length > 0){
          // console.log(assignedTo)
          assignFilter = `substringof('${assignedTo[0]["text"]}',CER/CERStatus) and `

        }
      } else if (status == "ALL") {
        statusfilter = "";
      } else {
        statusfilter = `CER/CERStatus eq '${status}' and `;
      }
      
    }

    const mfilter = `${assignFilter} ${statusfilter} ${assetfilter} ${plantfilter} ${dateFilter}`
    return (
      myWeb.lists
        .getByTitle(CERAsset)
        .items.select(fields)
        .expand("CER")
        .filter(encodeURIComponent(mfilter))
        // .select('*,Author/Id,Author/Title,Editor/Id,Editor/Title').expand('Author/Id,Author/Title,Editor/Id,Editor/Title')
        .getPaged()
    );
  }

  static getNextCall(
    promiseNext: Promise<PagedItemCollection<any[]>>,
    marray: any[]
  ) {
    return promiseNext.then(d => {
      if (d.results.length > 0) {
        marray.push(...d.results);
        // console.log(marray);
      }

      if (d.hasNext) {
        return this.getNextCall(d.getNext(), marray);
      } else {
        return Promise.resolve([]);
      }
    });
  }

  static async getHODApprovalMatrix(plant, role) {
    let filter = "Title eq '" + plant + "' and Role eq '" + role + "'";
    return myWeb.lists
      .getByTitle(CERApprovalMatrixtable)
      .items.filter(filter)
      .get();
  }

  static async getPlantFinanceApprovalMatrix(plant, role, costcentre) {
    let filter =
      "Title eq '" +
      plant +
      "' and Role eq '" +
      role +
      "' and substringof('" +
      costcentre +
      "',field1)";
    return myWeb.lists
      .getByTitle(CERApprovalMatrixtable)
      .items.filter(filter)
      .get();
  }


  static GetPendingApproval(){
    const xml = `<View>
        <Query>
            <Where>
                <And>
                    <Eq>
                        <FieldRef Name='WfAssignTask' LookupId='TRUE'/>
                        <Value Type='Lookup'>${_spPageContextInfo.userId}</Value>
                    </Eq>
                    <And>
                      <IsNull><FieldRef Name='TotalAmount'/></IsNull>
                      <Contains>
                        <FieldRef Name='CERStatus'/>
                        <Value Type='Text'>Waiting</Value>
                      </Contains>
                    </And>
                </And>
            </Where>
        </Query>
      </View>`;

    const camlQuery: CamlQuery = {
      ViewXml: xml
    };
    return myWeb.lists.getByTitle(CER)
      .getItemsByCAMLQuery(camlQuery);
    
    // return myWeb.lists.getByTitle(CER)
    //   .items
    //   // .filter(`WfAssignTask/Id eq ${_spPageContextInfo.userId} 
    //   .filter(`WfAssignTask/Id eq 183
    //   and TotalAmount le 0 and substringof('Waiting',CERStatus)`)
    //   .select("*,WfAssignTask/Id")
    //   .expand('WfAssignTask')
    //   .get();
  }

  static UpdateCER(cerid,payload){
    myWeb.lists.getByTitle(CER)
      .items.getById(cerid).update(payload)
  }

  

  //new cer
  static CERReport(dateFrom:Date,dateTo:Date){
      return myWeb.lists.getByTitle(CER)
        .items
        .filter(`Created ge datetime'${dateFrom.toISOString()}' and Created le datetime'${dateTo.toISOString()}'`)
        .expand()
        .getAll(5000)
  }







  static CERReportForFyear(Fyear){
    const xml = `<View>
        <Query>
            <Where>
                    <Eq>
                        <FieldRef Name='FYEAR'/>
                        <Value Type='Text'>${Fyear}</Value>
                    </Eq>
            </Where>
        </Query>
        <ViewFields>
            <FieldRef Name="ID"></FieldRef>
            <FieldRef Name="Title"></FieldRef>
            <FieldRef Name="CER_Plant"></FieldRef>
            <FieldRef Name="CER_AssetDtlsTotalCalAmnt2"></FieldRef>
            <FieldRef Name="CER_TblAssetDtlsMD"></FieldRef>
            <FieldRef Name="CER_ItemStatus"></FieldRef>
        </ViewFields>
      </View>`;

    const camlQuery: CamlQuery = {
      ViewXml: xml,
    };
    return myWeb.lists.getByTitle(CER)
      .getItemsByCAMLQuery(camlQuery);
}



  static GetAnnualBudget(){
    return myWeb.lists.getByTitle("AnnualBudget")
      .items
      .getAll(5000)
  } 

  static GetAnnualBudgetByFyear(fyear){
    return myWeb.lists.getByTitle("AnnualBudget")
      .items
      .filter(`FYEAR eq '${fyear}'`)
      .top(2000)
      .get()
  } 

  static GetApprovedNoApprovedDate(){
    return myWeb.lists.getByTitle("CER")
      .items
      .filter(`CER_ItemStatus eq 'APPROVED' and ApprovedDate eq null`)
      .expand("Versions")
      .get()
  }


  static GetApprovedCERs(){
    return myWeb.lists.getByTitle("CER")
      .items
      .filter(`CER_ItemStatus eq 'APPROVED' and ApprovedDate ne null`)
      .get()
  }


  static GetAllCERVersion(version){
    return myWeb.lists.getByTitle("CER")
      .items
      .filter(`CERVersion eq '${version}'`)
      .expand("Versions")
      .get()
  }

  static GetCERVersion(version){
    return myWeb.lists.getByTitle("CER")
      .items
      .filter(`CERVersion eq '${version}'`)
      .top(5000)
      .get()
  }


  static GETPendingCERs(version){

    return myWeb.lists.getByTitle("CER")
      .items
      .filter(`CERVersion eq '${version}' and CER_ItemStatus ne 'APPROVED' and CER_ItemStatus ne 'DRAFT' and CER_ItemStatus ne 'WITHDRAW' and CER_ItemStatus ne 'REJECTED'`)
      .expand("Versions,CER_Approval_MgrHODPlantFin,CER_Approval_GM_RCOO,CER_Approval_GFH_CFO,CER_Approval_GroupCOO,CER_Approval_GroupCFO")
     .select('*,CER_Approval_MgrHODPlantFin/Id,CER_Approval_GM_RCOO/Id,CER_Approval_GFH_CFO/Id,CER_Approval_GroupCOO/Id,CER_Approval_GroupCFO/Id')
      .getAll()
  }


  static test(){
    var url = `${_spPageContextInfo.webAbsoluteUrl}_api/web/lists/getByTitle('CER')/items?
    $filter=CER_ItemStatus ne 'APPROVED'
    $expand=Versions,CER_Approval_MgrHODPlantFin,CER_Approval_GM_RCOO,CER_Approval_GFH_CFO,CER_Approval_GroupCOO,CER_Approval_GroupCFO
    &$select=*,CER_Approval_MgrHODPlantFin/EMail,CER_Approval_GM_RCOO/EMail,CER_Approval_GFH_CFO/EMail,CER_Approval_GroupCOO/EMail,CER_Approval_GroupCFO/EMail`

    console.log('GETPendingCERs Url',url);

    const request =  client.fetch(`${url}`,{
          credentials:"same-origin",
          method:"GET"
          });

    return request
  }



  static GetAllCER(){
    return myWeb.lists.getByTitle("CER")
      .items
      .getAll(3000)
  }


  static async RevertCER(id,versionid){

    const list = await myWeb.lists.getByTitle("CER").get();

    // return await myWeb.lists.getByTitle("CER").items.getById(id)
    // .file.versions.restoreByLabel(versionLabel)

    // var url = `https://interplexgroup.sharepoint.com/sites/app/cer/_api/Web/Lists/getbytitle('CER)/items(${id})/Versions/restoreByLabel('${label}')`


    var url = `/sites/{029a1c38-4aa1-47c4-828d-7ef2b7b92056}/lists/{2F430205-2A3E-4623-9A82-501581D5899E}/items/${id}/versions/${versionid}/restoreVersion`
    return client.fetch(url,{
      method:"POST",
      // credentials:"same-origin"
    }) 
  }
}

export default CerAPI;
