import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
import _ = require("lodash");

const TRFORMS = "TR FORMS";
const TRDETAILS = "TRDetails";

let url =  "https://interplexgroup.sharepoint.com/sites/app/travel";
let myWeb = new Web(url);
// let myWeb = new pnp.Web(_spPageContextInfo.webAbsoluteUrl);
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    }
  }
});

class TravelApi {
  static AppSearch(searchtext) {
    // let filter = "substringof('" + searchtext + "',Title) or substringof('" + searchtext + "',Employee_x0020_No)";
    let filter =
      "substringof('" +
      searchtext +
      "',Title) or substringof('" +
      searchtext +
      "',TRCode) or substringof('" +
      searchtext +
      "',OData__ec2622ca_9f7b_4cf4_ba06_59937114648f)";
    return myWeb.lists
      .getByTitle(TRFORMS)
      .items.filter(filter)
      .orderBy("Modified", false)
      .select("*,Author/Id,Author/Title,Editor/Id,Editor/Title")
      .expand("Author/Id,Author/Title,Editor/Id,Editor/Title")
      .get();
  }

  static TravelDetailsSearch(searchtext) {
    // let filter = "substringof('" + searchtext + "',Title) or substringof('" + searchtext + "',Employee_x0020_No)";
    let filter = "substringof('" + searchtext + "',Title)";
    return myWeb.lists
      .getByTitle(TRDETAILS)
      .items.filter(filter)
      .orderBy("Modified", false)
      .select("*,Author/Id,Author/Title,Editor/Id,Editor/Title")
      .expand("Author/Id,Author/Title,Editor/Id,Editor/Title")
      .get();
  }

  static GetTravel(filter, itemcount = 1000, orderby = "", ascending = false) {
    return myWeb.lists
      .getByTitle(TRFORMS)
      .items.filter(filter)
      .top(itemcount)
      .orderBy(orderby || "ID", ascending)
      .get();
  }

  static GetTravelRequestByTRCode(code){
    return myWeb.lists.getByTitle(TRFORMS)
      .items.filter(`TRCode eq '${code}'`).get()
  }

  static TestUpdate(id, payload) {
    return myWeb.lists
      .getByTitle(TRFORMS)
      .items.getById(id)
      .update(payload);
  }

  static async GetTRDetails(empNo, staffName) {
    let selectedEmpNo = empNo;
    const selectedStaff = staffName;
    const whereFilter = " and Revised ne 'CLAIMED'";

    let filter =
      "EmpNo eq '" +
      selectedEmpNo +
      "' and substringof('" +
      selectedStaff +
      "',StaffName)";

    let trDetails = await myWeb.lists
      .getByTitle("TRDetails")
      .items.filter(filter + whereFilter)
      .orderBy("Title")
      .top(2000)
      .get();

    // trDetails.then(data => {
    return _.uniqBy(
      trDetails.map(item => {
        // return { value: item.Title, label: `${item.Title}` };
        return {
          ...item,
          value: item.Title
        };
      }),
      "value"
    );
    // });
    // return trDetails.then(data => {
    //   return _.uniqBy(
    //     data.map(item => {
    //       return { value: item.Title, label: `${item.Title}` };
    //     }),
    //     "value"
    //   );
    // });
  }

  static SetClaimed(trcode: string) {
    const filter = `Title eq '${trcode}'`;

    myWeb.lists
      .getByTitle(TRDETAILS)
      .items.filter(filter)
      .get()
      .then(results => {
        results.map(x => {
          this.UpdateTRDetails(x.Id, { Revised: "CLAIMED" });
        });
      });
  }


  static AddTRDetails(spObj){
    return myWeb.lists
    .getByTitle(TRDETAILS)
    .items
    .add(spObj);
  }


  static UpdateTRDetails(id, spObj) {
    return myWeb.lists
      .getByTitle(TRDETAILS)
      .items.getById(id)
      .update(spObj);
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


  static GetTRDetailsQuery(filter){
    return myWeb.lists.getByTitle(TRDETAILS)
      .items.filter(filter)
      .get()
  }

  static GetTRDetailsCamlQuery(filter){

    const camlQuery: CamlQuery = {
      ViewXml: filter
    };

    return myWeb.lists.getByTitle(TRDETAILS)
      .getItemsByCAMLQuery(camlQuery)
      
  }

  static GetTravelFile(id: number) {
    return myWeb.lists
      .getByTitle(TRFORMS)
      .items.getById(id)
      .file.getText();
  }
}

export default TravelApi;
