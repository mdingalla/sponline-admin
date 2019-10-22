import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
import _ = require("lodash");

const MAPCC = "MapCC";
const CCGroup = 'CCGroup';
const HRCostCentre = 'HRCostCentre'

let myWeb = new Web(_spPageContextInfo.webAbsoluteUrl);
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    }
  }
});


class CostCenterMapApi {
    // static GetCCGroup(){

    //     const xml = `<View>
    //          <Query>
    //             <GroupBy Collapse="TRUE">
    //              <FieldRef Name="CC_x0020_Group" />
    //             </GroupBy>
    //         </Query>
    //     </View>`;

    //     const camlQuery: CamlQuery = {
    //     ViewXml: xml
    //     };

    //     return myWeb.lists.getByTitle(MAPCC)
    //         .getItemsByCAMLQuery(camlQuery)
    // }
    static GetCCGroup(){
      return myWeb.lists.getByTitle(CCGroup)
        .items.get();
    }


    static async GetRegion(){

      const xml = `<View>
        <Query>
            <Where>
            <Eq>
            <FieldRef Name='IsActive' />
            <Value Type='Boolean'>1</Value>
        </Eq>
            </Where>
        </Query>
      </View>`;

    const camlQuery: CamlQuery = {
      ViewXml: xml
    };

      const query:any[] = await myWeb.lists.getByTitle(MAPCC)
        .getItemsByCAMLQuery(camlQuery)

      

      return  query.map((x)=>{
        return x.Region
      })
      
    }

    static GetCostCenter(costcenter){
      return myWeb.lists.getByTitle(MAPCC)
        .items.filter(`substringof('${costcenter}',SAP_x0020_CC_x0020_Code)`)
        .get();
    }

    static GetCostCenterById(id){
      return myWeb.lists.getByTitle(MAPCC)
        .items.getById(id)
        .get();
    }

    static UpdateMapCostCenter(id,payload){
      return myWeb.lists.getByTitle(MAPCC)
        .items.getById(id)
        .update(payload)
    }


    static QueryAll(){
      return myWeb.lists.getByTitle(MAPCC)
        .items.top(5000)
        .get()
    }

    static async QueryNotActiveAll(){
      const xml = `<View>
        <Query>
            <Where>
              <Or>
                <Eq>
                  <FieldRef Name='IsActive' />
                  <Value Type='Boolean'>0</Value>
                </Eq>
                    <IsNull>
                    <FieldRef Name='IsActive' /></IsNull>
                </Eq>
              </Or>
            </Where>
        </Query>
      </View>`;

    const camlQuery: CamlQuery = {
      ViewXml: xml
    };

      const query:any[] = await myWeb.lists.getByTitle(MAPCC)
        .getItemsByCAMLQuery(camlQuery)

      return query;

    }


    static GetHRCostCenter(){
      return myWeb.lists.getByTitle(HRCostCentre)
        .items.getAll();
    }


    static GetActiveCostCenter(){
      return myWeb.lists.getByTitle("ActiveCC")
        .items.getAll();
    }
}

export default CostCenterMapApi;

