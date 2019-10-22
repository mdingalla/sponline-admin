import { SPOnlineLegalSite } from "../constants/config";



export default class LegalWebApi {
    static QueryCounterParty(){
        return fetch(`${SPOnlineLegalSite}/_api/web/lists/getbytitle('CounterPartyMaster')/items`,{
            credentials: 'include',
            method: 'GET',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
                Accept: 'application/json;odata=verbose',
                // 'Content-Type': 'application/json', // will fail if provided
                // 'X-ClientService-ClientTag': 'PnPCoreJS', // will fail if provided
            }
        })
        .then(r => r.json())
    }
}