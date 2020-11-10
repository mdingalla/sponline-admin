import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
import { SPCostCenterRequest } from '../../types/models';

import { GLItem } from "../../types/models";

const PettyCashReimbursementRequest = "PettyCashReimbursementRequest";
const GLITEMS = "PTC GL Items";
const GLDESCRIPTION = "GL Description";


let url =  "https://interplexgroup.sharepoint.com/sites/app/pettycash";
let myWeb = new Web(url);
// let myWeb = new pnp.Web(_spPageContextInfo.webAbsoluteUrl);


class PettyCashApi {
  static AppSearch(searchtext) {
    // let filter = "substringof('" + searchtext + "',Title) or substringof('" + searchtext + "',Employee_x0020_No)";
    let filter = "substringof('" + searchtext + "',Title)";
    return myWeb.lists
      .getByTitle(PettyCashReimbursementRequest)
      .items.filter(filter)
      .orderBy("Modified", false)
      .select("*,Author/Id,Author/Title,Editor/Id,Editor/Title")
      .expand("Author/Id,Author/Title,Editor/Id,Editor/Title")
      .get();
  }

  static AddGLReport(glitem) {
    return myWeb.lists.getByTitle(GLITEMS).items.add(glitem);
  }

  static GLAppSearch(searchtext) {
    // let filter = "substringof('" + searchtext + "',Title) or substringof('" + searchtext + "',Employee_x0020_No)";
    let filter = "substringof('" + searchtext + "',Title)";
    return myWeb.lists
      .getByTitle(GLITEMS)
      .items.filter(filter)
      .orderBy("Modified", false)
      .select("*,Author/Id,Author/Title,Editor/Id,Editor/Title")
      .expand("Author/Id,Author/Title,Editor/Id,Editor/Title")
      .get();
  }

  static GLSample() {
    let fields =
      "Amount,GLAccount,ClaimType,BusinessArea,Department,CostCentre,Title,Curr,EmpNo,PayTo,DteExpenseDate,";
    // let filter = "substringof('" + searchtext + "',Title)";
    return myWeb.lists
      .getByTitle(GLITEMS)
      .items // .filter(filter)
      .orderBy("Modified", false)
      .top(30000)
      .select("*,Author/Id,Author/Title,Editor/Id,Editor/Title")
      .expand("Author/Id,Author/Title,Editor/Id,Editor/Title")
      .get();
  }

  static GetGLReportByPTCNo(ptcno){
    return myWeb.lists.getByTitle(GLITEMS)
      .items.filter(`Title eq '${ptcno}'`)
      .get();
  }

  static GLReportQuery(
    startDt: Date,
    endDt: Date
  ): Promise<PagedItemCollection<GLItem[]>> {
    let fields =
      "Method,Amount,GLAccount,ClaimType,BusinessArea,Department,CostCentre,Title,Curr,EmpNo,PayTo,DteExpenseDate,ExpenseDate";
    let filter =
      "substringof('/" +
      startDt.getFullYear() +
      "',ExpenseDate) or substringof('/" +
      endDt.getFullYear() +
      "',ExpenseDate)";
    return (
      myWeb.lists
        .getByTitle(GLITEMS)
        .items.select(fields)
        .filter(filter)
        // .select('*,Author/Id,Author/Title,Editor/Id,Editor/Title').expand('Author/Id,Author/Title,Editor/Id,Editor/Title')
        .getPaged()
    );
  }

  static getNextCall(
    promiseNext: Promise<PagedItemCollection<GLItem[]>>,
    marray: GLItem[]
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

  static GetGLDescriptions() {
    return myWeb.lists
      .getByTitle(GLDESCRIPTION)
      .items.top(300)
      .get();
  }

  static DeleteGLReportById(id)
  {
    return myWeb.lists.getByTitle(GLITEMS)
      .items.getById(id).delete();
  }

  static GetPettyCash(
    filter,
    itemcount = 1000,
    orderby = "",
    ascending = false
  ) {
    return myWeb.lists
      .getByTitle(PettyCashReimbursementRequest)
      .items.filter(filter)
      .top(itemcount)
      .orderBy(orderby || "ID", ascending)
      .get();
  }

  static GetPTCFile(id: number) {
    return myWeb.lists
      .getByTitle(PettyCashReimbursementRequest)
      .items.getById(id)
      .file.getText();
  }

  static TestUpdate(id, payload) {
    return myWeb.lists
      .getByTitle(PettyCashReimbursementRequest)
      .items.getById(id)
      .update(payload);
  }

  static GetListId(listname) {
    return myWeb.lists
      .getByTitle(listname)
      .get()
      .then(list => {
        return list.Id;
      });
  }

  static FindTRCode(trcode) {
    return myWeb.lists
      .getByTitle(PettyCashReimbursementRequest)
      .items.filter(`TRCode eq '${trcode}'`)
      .get();
  }

  static GetTaskByUserId(userid){
    const xml = `<View>
        <Query>
            <Where>
                <And>
                    <Eq>
                        <FieldRef Name='AssignedTo' LookupId='TRUE'/>
                        <Value Type='Lookup'>${userid}</Value>
                    </Eq>
                        <IsNull><FieldRef Name='RelatedURL'/></IsNull>
                    </And>
                </And>
            </Where>
        </Query>
      </View>`;

    const camlQuery: CamlQuery = {
      ViewXml: xml
    };
    return myWeb.lists.getByTitle("Tasks").getItemsByCAMLQuery(camlQuery);
  }

  // static TriggerWorkflow(itemId) {
  //   // export async function TriggerPTCNextApproval(itemId) {
  //   SP.SOD.registerSod("sp.js", "/_layouts/15/sp.js");
  //   SP.SOD.registerSod("sp.runtime.js", "/_layouts/15/sp.runtime.js");
  //   SP.SOD.registerSod(
  //     "SP.WorkflowServices.js",
  //     "/_layouts/15/sp.workflowservices.js"
  //   );

  //   // const guid = "{e78ca57b-3aa3-4a75-94a4-0b3bdfac18e4}";
  //   // let subId = new SP.Guid(guid);

  //   var clientContext = SP.ClientContext.get_current();
  //   var web = clientContext.get_web();

  //   var wfServiceManager = SP.WorkflowServices.WorkflowServicesManager.newObject(
  //     clientContext,
  //     web
  //   );
  //   var wfDeployService = wfServiceManager.getWorkflowDeploymentService();
  //   // var subService = wfServiceManager.getWorkflowSubscriptionService();
  //   var subService = wfServiceManager
  //     .getWorkflowSubscriptionService()
  //     .enumerateSubscriptionsByList(PTCNextListID);

  //   clientContext.load(subService);

  //   clientContext.executeQueryAsync(
  //     function() {
  //       var wfsEnum = subService.getEnumerator();
  //       while (wfsEnum.moveNext()) {
  //         var wfSub = wfsEnum.get_current();
  //         if (wfSub.get_name() === PTCNextWorkflowName) {
  //           wfServiceManager
  //             .getWorkflowInstanceService()
  //             .startWorkflowOnListItem(wfSub, itemId, new Object());

  //           clientContext.executeQueryAsync(
  //             function() {
  //               console.log("Successfully started workflow.");
  //             },
  //             function(sender, args) {
  //               console.log("Failed to start the workflow.");
  //               console.log(
  //                 "Error: " + args.get_message() + "\n" + args.get_stackTrace()
  //               );
  //             }
  //           );
  //         }
  //       }
  //     },
  //     function(e) {
  //       console.error(e);
  //     }
  //   );

  //   // }
  // }

  static GetMedicalCapEntitlement(title, joblevel) {
    return myWeb.lists
      .getByTitle("MedicalCapEntitlement")
      .items.filter(`Title eq '${title}' and JobLevel eq '${joblevel}'`)
      .get();
  }

  static GetMedicalCouncilCapEntitlement(empno) {
    return myWeb.lists
      .getByTitle("MedicalEntCapForCouncil")
      .items.filter(`EmpNo eq '${empno}'`)
      .get();
  }

  static GetMedicalClaims(empNo, payTo, dateFrom: Date, dateTo: Date) {
    var filter = `ClaimType eq 'Medical' and EmpNo eq '${empNo}' and PayTo eq '${payTo}'`;
    // and (substringof('/${dateFrom.getFullYear().toString()}',ExpenseDate) or substringof('/${dateTo.getFullYear().toString()}',ExpenseDate))`;
    return myWeb.lists
      .getByTitle(GLITEMS)
      .items.filter(filter)
      .get();
  }

  static UpdatetaskById(id,payload){
    myWeb.lists.getByTitle("Tasks")
      .items.getById(id)
      .update(payload)
  }

  static GetEmptyUrl(){
    const xml = `<View>
        <Query>
            <Where>
                <Or>
                    <Neq>
                        <FieldRef Name='RelatedURL' />
                        <Value Type='Description'>View</Value>
                    </Neq>
                        <IsNull><FieldRef Name='RelatedURL'/></IsNull>
                </Or>
            </Where>
        </Query>
      </View>`;

    const camlQuery: CamlQuery = {
      ViewXml: xml
    };
    return myWeb.lists.getByTitle("Tasks").getItemsByCAMLQuery(camlQuery);
  }
}

export default PettyCashApi;
