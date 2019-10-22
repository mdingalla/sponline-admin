import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery} from '@pnp/sp'
import { SPCostCenterRequest } from '../../types/models';


const COSTCENTER_REQUEST = "CostCenterRequests";
const COSTCENTER_REQUEST_SETTINGS = "CostCenterRequestSettings";


// let url = window.location.protocol + '//iconnect.interplex.com'
let myWeb = sp.web;


class CostCenterRequestApi {

    static CreateUpdateRequest(payload:Partial<SPCostCenterRequest>,id){
        if(id){
           return this.UpdateRequest(id,payload)
        }
        else{
            return this.CreateRequest(payload)
        }
    }

    static CreateRequest(payload:Partial<SPCostCenterRequest>){
        return myWeb.lists.getByTitle(COSTCENTER_REQUEST)
            .items.add(payload);
    }

    static GetCostCenterRequest(id) : Promise<any> {
        return myWeb.lists.getByTitle(COSTCENTER_REQUEST)
            .items.getById(id).get()
    }


    static GetCostCenterRequestSettings(filterTitle){
        return myWeb.lists.getByTitle(COSTCENTER_REQUEST_SETTINGS)
        .items.filter(`Title eq '${filterTitle}'`).get();
    }

    static GetCostCenterRequestByCC(costcenter){
        return myWeb.lists.getByTitle(COSTCENTER_REQUEST)
            .items.filter(`WFlowStatus eq 'APPROVED' and CostCentre eq '${costcenter}'`)
            .orderBy('ApprovedByDate',false)
            .get();
    }

    static GetPendingRequests(){
        const userId = _spPageContextInfo.userId
        const xml = `<View>
        <Query>
            <Where>
                <And>
                <Eq> 
                    <FieldRef Name='MultiAssignedTo' LookupId='True'/> 
                    <Value Type='Lookup'>${userId}</Value> 
                </Eq> 
                <Eq> 
                    <FieldRef Name='WFlowStatus' /> 
                    <Value Type='Text'>PENDING</Value> 
                </Eq> 
                </And>
            </Where>
        </Query>
    </View>`;

    const q: CamlQuery = {
        ViewXml: xml,
    };

        return myWeb.lists.getByTitle(COSTCENTER_REQUEST)
            .getItemsByCAMLQuery(q)
    }


    static GetMyRequests(){
        const userId = _spPageContextInfo.userId
        const xml = `<View>
        <Query>
            <Where>
                <Or>
                <Eq> 
                    <FieldRef Name='Author' LookupId='True'/> 
                    <Value Type='Lookup'>${userId}</Value> 
                </Eq> 
                <Eq> 
                    <FieldRef Name='Requestor' LookupId='True'/> 
                    <Value Type='Lookup'>${userId}</Value> 
                </Eq> 
                </Or>
            </Where>
            <OrderBy>
            <FieldRef Name="Created" Ascending="False" />
            </OrderBy>
        </Query>
    </View>`;

    const q: CamlQuery = {
        ViewXml: xml,
    };

        return myWeb.lists.getByTitle(COSTCENTER_REQUEST)
            .getItemsByCAMLQuery(q)
    }

    static GetMyActionRequests(){
        const userId = _spPageContextInfo.userId
        const xml = `<View>
        <Query>
            <Where>
            <And>
                <Or>
                    <Eq> 
                        <FieldRef Name='ACKPPLSAP' LookupId='True'/> 
                        <Value Type='Lookup'>${userId}</Value> 
                    </Eq> 
                    <Or>
                        <Eq> 
                            <FieldRef Name='ACKPPLCOGNOS' LookupId='True'/> 
                            <Value Type='Lookup'>${userId}</Value> 
                        </Eq> 
                        <Or>
                            <Eq> 
                                <FieldRef Name='ACKPPLTAPPLENT' LookupId='True'/> 
                                <Value Type='Lookup'>${userId}</Value> 
                            </Eq>
                            <Eq> 
                                <FieldRef Name='ACKPPLPAYROLL' LookupId='True'/> 
                                <Value Type='Lookup'>${userId}</Value> 
                            </Eq> 
                        </Or> 
                    </Or>
                </Or>
                <Eq> 
                    <FieldRef Name='WFlowStatus' /> 
                    <Value Type='Text'>APPROVED</Value> 
                </Eq> 
            </And>
            </Where>
            <OrderBy>
            <FieldRef Name="Created" Ascending="False" />
            </OrderBy>
        </Query>
    </View>`;

    const q: CamlQuery = {
        ViewXml: xml,
    };

        return myWeb.lists.getByTitle(COSTCENTER_REQUEST)
            .getItemsByCAMLQuery(q)
    }



    static UpdateRequest(id:number,payload:Partial<SPCostCenterRequest>){
        return myWeb.lists.getByTitle(COSTCENTER_REQUEST)
            .items.getById(id).update(payload);
    }
}

export default CostCenterRequestApi;